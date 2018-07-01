import {Component, OnInit} from '@angular/core';
import {RestService} from '../rest.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Spiel} from '../model/spiel';
import {JoinGameDialogComponent} from '../join-game-dialog/join-game-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {Router} from '@angular/router';
import { MessagingService } from '../messaging.service';

@Component({
	selector: 'app-game-list',
	templateUrl: './game-list.component.html',
	styleUrls: ['./game-list.component.scss'],
})
export class GameListComponent implements OnInit {
	onUnsubscribe = new Subject();
	games: Spiel[];

	constructor(
		private rest: RestService,
		private dialog: MatDialog,
		private router: Router,
		private mqtt: MessagingService
	) {
	}

	ngOnInit() {
		this.mqtt
		.subscribeToTopic('/+/playerJoined')
		.pipe(takeUntil(this.onUnsubscribe))
		.subscribe(() => {
			this.loadGames();
		});

		this.mqtt
		.subscribeToTopic('/gameCreated')
		.pipe(takeUntil(this.onUnsubscribe))
		.subscribe(() => {
			this.loadGames();
		});
		this.loadGames();
	}

	public loadGames() {
		this.rest
			.getSessions()
			.pipe(takeUntil(this.onUnsubscribe))
			.subscribe((x) => {
				console.log(x);
				this.games = x.filter((x) => x.anzahlSpieler < 4);
			});
	}

	public joinSession(game: Spiel) {
		const config: MatDialogConfig = new MatDialogConfig();
		config.data = game.spielID;
		let dialogRef = this.dialog.open(JoinGameDialogComponent, config);
		dialogRef.afterClosed().subscribe((result: string) => {
			console.log(result);

			if (result !== null && result !== undefined) {
				this.rest
					.joinSession(game, result)
					.pipe(takeUntil(this.onUnsubscribe))
					.subscribe((x) => {
						console.log(x);
						this.router.navigate(['game', game.spielID, result]);
					});
			}
		});
	}

	ngOnDestroy(): void {
		this.onUnsubscribe.next();
		this.onUnsubscribe.complete();
	}
}
