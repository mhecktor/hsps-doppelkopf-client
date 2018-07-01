import {Component, OnInit, Inject} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Subject} from 'rxjs';
import {RestService} from '../rest.service';
import {MessagingService} from '../messaging.service';

@Component({
	selector: 'app-join-game-dialog',
	templateUrl: './join-game-dialog.component.html',
	styleUrls: ['./join-game-dialog.component.scss'],
})
export class JoinGameDialogComponent implements OnInit {
	onUnsubscribe = new Subject();
	playerName: String = '';

	constructor(
		private dialogRef: MatDialogRef<JoinGameDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public gameId: string,
		private rest: RestService,
		private mqtt: MessagingService
	) {
		this.mqtt
			.subscribeToTopic(`/${this.gameId}/playerJoined`)
			.pipe(takeUntil(this.onUnsubscribe))
			.subscribe(() => this.loadSession());
		this.loadSession();
	}

	ngOnInit() {}

	public loadSession() {
		this.rest
			.getSession(this.gameId)
			.pipe(takeUntil(this.onUnsubscribe))
			.subscribe((result) => {
				if (result.spieler.indexOf(null) === -1) {
					this.dialogRef.close(null);
				}
			});
	}

	onNoClick() {
		this.dialogRef.close(null);
	}

	onYesClick() {
		this.dialogRef.close(this.playerName);
	}

	ngOnDestroy(): void {
		this.onUnsubscribe.next();
		this.onUnsubscribe.complete();
	}
}
