import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {RestService} from './rest.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
	MatGridListModule,
	MatCardModule,
	MatMenuModule,
	MatIconModule,
	MatButtonModule,
	MatInputModule,
	MatPaginatorModule,
	MatSortModule,
	MatToolbarModule,
	MatDialogModule,
	MatFormFieldModule,
	MatCheckboxModule,
	MatListModule,
	MatProgressSpinnerModule,
	MatSnackBarModule,
} from '@angular/material';
import {DashboardComponent} from './dashboard/dashboard.component';
import {GameRoomComponent} from './game-room/game-room.component';
import {GameListComponent} from './game-list/game-list.component';
import {CreateGameComponent} from './create-game/create-game.component';
import {FormsModule} from '@angular/forms';
import {GameComponent} from './game-component/game-component.component';
import {MessagingService} from './messaging.service';
import {MqttModule, IMqttServiceOptions} from 'ngx-mqtt';
import {JoinGameDialogComponent} from './join-game-dialog/join-game-dialog.component';
import {PlayerListComponent} from './ui-components/player-list/player-list.component';
import {CardComponent} from './ui-components/card/card.component';
import {PlayerHandComponent} from './ui-components/player-hand/player-hand.component';

const appRoutes: Routes = [
	{
		path: 'dashboard',
		component: DashboardComponent,
		data: {title: 'Dashboard'},
	},
	{
		path: 'games',
		component: GameListComponent,
		data: {title: 'Spiele'},
	},
	{
		path: 'game/:id/:playerName',
		component: GameComponent,
		data: {title: 'Spiel'},
	},
	{
		path: '',
		redirectTo: '/dashboard',
		pathMatch: 'full',
	},
];

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
	hostname: 'localhost',
	port: 9001,
};

@NgModule({
	declarations: [
		AppComponent,
		DashboardComponent,
		GameRoomComponent,
		GameListComponent,
		CreateGameComponent,
		GameComponent,
		JoinGameDialogComponent,
		PlayerListComponent,
		PlayerHandComponent,
		CardComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		RouterModule.forRoot(appRoutes, {enableTracing: false}),
		MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
		BrowserAnimationsModule,
		FormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatGridListModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatListModule,
		MatCardModule,
		MatMenuModule,
		MatIconModule,
		MatButtonModule,
		MatToolbarModule,
		MatPaginatorModule,
		MatSortModule,
		MatDialogModule,
	],
	entryComponents: [CreateGameComponent, JoinGameDialogComponent],
	providers: [RestService, MessagingService],
	bootstrap: [AppComponent],
})
export class AppModule {}
