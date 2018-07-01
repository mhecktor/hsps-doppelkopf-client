import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {RestService} from '../rest.service';
import {Spieler} from '../model/spieler';
import {Spiel} from '../model/spiel';
import {MessagingService} from '../messaging.service';
import {Card} from '../model/card';
import {Hand} from '../model/hand';
import { MatSnackBar } from '@angular/material';

@Component({
	selector: 'app-game-component',
	templateUrl: './game-component.component.html',
	styleUrls: ['./game-component.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
	onUnsubscribe = new Subject();

	playerName: String;
	gameId: String;
	game: Spiel;
	cards: Card[] = [];
	playerCards = new Map<String, Hand>();
	tableCards: {player: String, card: Card}[] = [];
	myOffset: number = 0;

	constructor(
		private route: ActivatedRoute,
		private rest: RestService,
		private router: Router,
		private mqtt: MessagingService,
		private sb: MatSnackBar
	) {
		this.route.params
			.pipe(takeUntil(this.onUnsubscribe))
			.subscribe((params) => {
				this.gameId = params.id;
				this.playerName = params.playerName;

				this.mqtt
					.subscribeToTopic(`/${this.gameId}/${this.playerName}`)
					.pipe(takeUntil(this.onUnsubscribe))
					.subscribe((result) => {
						switch(result.data.type) {
							case 'AskKoenigSolo' : {
								console.log('AskKoenigSolo', result);
								if (confirm('Möchten sie ein Königssolo spielen?')) {
									this.rest.performDecision(this.gameId, this.playerName, true)
									.pipe(takeUntil(this.onUnsubscribe))
									.subscribe((result) => {
										console.log(result);
										this.loadSession();
									});
								} else {
									this.rest.performDecision(this.gameId, this.playerName, false)
									.pipe(takeUntil(this.onUnsubscribe))
									.subscribe((result) => {
										console.log(result);
										this.loadSession();
									});
								}
								break;
							}
							case 'AskSchmeissen' : {
								console.log('AskSchmeissen', result);
								if (confirm('Wollen sie schmeißen?')) {
									this.rest.performDecision(this.gameId, this.playerName, true)
									.pipe(takeUntil(this.onUnsubscribe))
									.subscribe((result) => {
										console.log(result);
										this.loadSession();
									});
								} else {
									this.rest.performDecision(this.gameId, this.playerName, false)
									.pipe(takeUntil(this.onUnsubscribe))
									.subscribe((result) => {
										console.log(result);
										this.loadSession();
									});
								}
								break;
							}
							case 'GetCard' : {
								this.cards.push(<Card>result.data.data);
								if(this.playerCards.get(this.playerName)) {
									const hand = this.playerCards.get(this.playerName);
									hand.karten.push(<Card>result.data.data);
									if(hand.karten.length === 10) {
										this.loadSession();
									}
								} else {
									this.playerCards.set(this.playerName, {re: false, karten: [<Card>result.data.data]});
								}
								break;
							}
							case 'ChooseCard': {
								alert("Bitte waehlen sie eine Karte");
								break;
							}
							case 'ValidCard' : {
								this.loadSession();
								break;
							}
							default : {
								console.log(result);
							}
						}
					});
				
					this.mqtt.subscribeToTopic(`/${this.gameId}/cardPlayed`)
					.pipe(takeUntil(this.onUnsubscribe))
					.subscribe((result) => {
						console.log(`/${this.gameId}/cardPlayed`,result);
						this.tableCards.push({
							player: this.game.currentSpielerName,
							card: <Card> result.data.data
						});
						this.loadSession();
					});

					this.mqtt.subscribeToTopic(`/${this.gameId}/playerGotStich`)
					.pipe(takeUntil(this.onUnsubscribe))
					.subscribe((result) => {
						this.sb.open("Stich ging an " + result.data.data,'x', {
							duration: 1000
						});
						this.loadSession();
					});

				this.rest
					.getSession(params.id)
					.pipe(takeUntil(this.onUnsubscribe))
					.subscribe((session) => {
						if (session === null) {
							this.router.navigate(['dashboard']);
						}
						this.game = session;
						this.myOffset = this.game.spieler.indexOf(this.playerName);

						if (session && session.gameState) {
							this.loadPlayerCards(session);
						}

						this.mqtt
							.subscribeToTopic(`/${this.gameId}/playerJoined`)
							.pipe(takeUntil(this.onUnsubscribe))
							.subscribe((result) => {
								this.rest
									.getSession(params.id)
									.pipe(takeUntil(this.onUnsubscribe))
									.subscribe((session) => {
										this.game = session;
									});
							});
						this.mqtt
							.subscribeToTopic('generell')
							.pipe(takeUntil(this.onUnsubscribe))
							.subscribe((x) => {
								console.log('generell', x);
								if(x.data.type === 'EndedGame') {
									if(x.data.data === this.playerName || x.data.data === null) {
										
									}
								}
								if(x.data.type === 'GameRunning') {
									this.loadSession();
								}
							});
					});
			});
	}

	private loadPlayerCards(session: Spiel) {
		session.spieler.forEach((player) => {
			this.rest
				.getCards(this.game, player)
				.pipe(takeUntil(this.onUnsubscribe))
				.subscribe((res) => {
					this.playerCards.set(player, res);
				});
		});
	}

	ngOnInit() {}

	ngOnDestroy(): void {
		this.onUnsubscribe.next();
		this.onUnsubscribe.complete();
	}

	public loadSession() {
		this.rest
			.getSession(this.gameId)
			.pipe(takeUntil(this.onUnsubscribe))
			.subscribe((session) => {
				this.game = session;
				this.loadPlayerCards(session);
			});
	}

	public isGameNotFull() {
		if (this.game && this.game.spieler) {
			return this.game.spieler.indexOf(null) !== -1;
		} else {
			false;
		}
	}

	public startGame() {
		this.rest
			.startSession(this.game)
			.pipe(takeUntil(this.onUnsubscribe))
			.subscribe((session) => {
				console.log(session);
				this.game = session;
			});
	}
}
