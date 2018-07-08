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
import { MatSnackBar, MatDialog } from '@angular/material';
import { YesNoDialogComponent } from '../ui-components/yes-no-dialog/yes-no-dialog.component';
import { Statistik } from '../model/statistic';


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
	gameEnded: boolean = false;
	cards: Card[] = [];
	playerCards = new Map<String, Hand>();
	tableCards: {player: String, card: Card}[] = [];
	myOffset: number = 0;
	winner: boolean;
	statistik: Statistik;

	constructor(
		private route: ActivatedRoute,
		private rest: RestService,
		private router: Router,
		private mqtt: MessagingService,
		private sb: MatSnackBar,
		private dialog: MatDialog
	) {		
		this.route.params
			.pipe(takeUntil(this.onUnsubscribe))
			.subscribe((params) => {
				this.gameId = params.id;
				this.playerName = params.playerName;

				// Show in DEMO
				this.mqtt
					.subscribeToTopic(`/${this.gameId}/${this.playerName}`)
					.pipe(takeUntil(this.onUnsubscribe))
					.subscribe((result) => {
						switch(result.data.type) {
							case 'AskKoenigSolo' : {
								console.log('AskKoenigSolo', result);
								const dialogRef = this.dialog.open(YesNoDialogComponent, {
									width: '250px',
									data: 'Möchten sie ein Königssolo spielen?'
								  });
							  
								  dialogRef.afterClosed().subscribe(result => {
									this.rest.performDecision(this.gameId, this.playerName, result)
									.pipe(takeUntil(this.onUnsubscribe))
									.subscribe((result) => {
										console.log(result);
										this.loadSession();
									});

								  });								
								break;
							}
							case 'AskSchmeissen' : {
								console.log('AskSchmeissen', result);
								const dialogRef = this.dialog.open(YesNoDialogComponent, {
									width: '250px',
									data: 'Wollen sie schmeißen?'
								  });
							  
								  dialogRef.afterClosed().subscribe(result => {
									this.rest.performDecision(this.gameId, this.playerName, result)
									.pipe(takeUntil(this.onUnsubscribe))
									.subscribe((result) => {
										console.log(result);
										this.loadSession();
									});

								  });
								break;
							}
							case 'AskReContraAnnouncement': {
								const text = `${this.playerName} möchten sie ${result.data.data} ansagen?`
								say(`${this.playerName} möchten sie ansagen`)
								const dialogRef = this.dialog.open(YesNoDialogComponent, {
									width: '250px',
									data: text
								  });
							  
								  dialogRef.afterClosed().subscribe(result => {
									this.rest.performAnnouncement(this.gameId, this.playerName, result)
									.pipe(takeUntil(this.onUnsubscribe))
									.subscribe((result) => {
										this.loadSession();
									});
								  });
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
								say(`Bitte wählen sie eine Karte ${this.playerName}!`);
								this.sb.open("Bitte wählen sie eine Karte!" ,'x', {
									duration: 4000,
									horizontalPosition: 'center',
      								verticalPosition: 'top',
								});
								break;
							}
							case 'ValidCard' : {
								this.loadSession();
								break;
							}		
							case 'LOSE': {
								this.winner = false;
								this.statistik = <Statistik> result.data.data
								break;
							}		
							case 'WIN': {
								this.winner = true;
								this.statistik = <Statistik> result.data.data
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
						say(`Stich ging an ${result.data.data}`)
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
								switch(x.data.type) {
									case 'EndedGame' : {
										this.gameEnded = true;
										break;
									}
									case 'RestartGame' : {
										location.reload();
										break;
									}
									case 'GameRunning' : {
										this.loadSession();
										break;
									}
									case 'Announcement': {
										const text = `${x.data.data}`
										say(text)
										this.sb.open(text ,'x', {
											duration: 4000,
											horizontalPosition: 'center',
											  verticalPosition: 'top',
										});
										break;
									}
									default : {
										break;
									}
								}					
								
							});
					});
			});
	}

	// Show in DEMO
	private loadPlayerCards(session: Spiel) {
		this.rest
			.getCards(this.game, this.playerName)
			.pipe(takeUntil(this.onUnsubscribe))
			.subscribe((res) => {
				this.playerCards.set(this.playerName, res);
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
				say("Starting game");
			});
	}
}

let voices: SpeechSynthesisVoice[] = [];
window.speechSynthesis.onvoiceschanged = function() {
    voices = window.speechSynthesis.getVoices();
};

export function say(text: string) {
	console.log(voices);
	var synth = window.speechSynthesis;
	if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if (text !== '') {
	var utterThis = new SpeechSynthesisUtterance(text);
	console.log(synth.getVoices());
	synth.getVoices().forEach((x) => {
		if(x.name === 'Anna') {
			utterThis.voice = x;
		}
	});
	// https://github.com/mdn/web-speech-api/blob/master/speak-easy-synthesis/script.js   
    synth.speak(utterThis);
  }
}