import {Component, OnInit, OnDestroy} from '@angular/core';
import {RestService} from '../rest.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Spiel } from '../model/spiel';

@Component({
	selector: 'app-create-game',
	templateUrl: './create-game.component.html',
	styleUrls: ['./create-game.component.scss'],
})
export class CreateGameComponent implements OnInit, OnDestroy {

	public newGame = {
		playerName: '',
		gameName: '',
		rounds: 0,
		rules: {
			armut: false,
			schweinchen: false,
			zweiteDulle: false,
			schmeissen: false,
			koenigsSolo: false,
			pflichtAnsage: false,
		},
	};
	onUnsubscribe = new Subject();

	constructor(private rest: RestService, 
		private dialogRef: MatDialogRef<CreateGameComponent>,
		private router: Router) {

		}

	ngOnInit() {}
	ngOnDestroy(): void {
		this.onUnsubscribe.next();
		this.onUnsubscribe.complete();
	}

	create() {
		this.rest
			.createGame(this.newGame)
			.pipe(takeUntil(this.onUnsubscribe))
			.subscribe((game: Spiel) => {
				this.dialogRef.close();
				this.router.navigate(['/game', game.spielID, this.newGame.playerName]);
			});
	}
}
