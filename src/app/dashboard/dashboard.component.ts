import {Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import {CreateGameComponent} from '../create-game/create-game.component';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
	constructor(private dialog: MatDialog) {}

  ngOnInit() {}
  
  public createGame() {
		const config: MatDialogConfig = new MatDialogConfig();
		this.dialog.open(CreateGameComponent, config);
  }
}
