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
} from '@angular/material';
import {DashboardComponent} from './dashboard/dashboard.component';
import {GameRoomComponent} from './game-room/game-room.component';
import {GameListComponent} from './game-list/game-list.component';
import {CreateGameComponent} from './create-game/create-game.component';
import { FormsModule } from '@angular/forms';

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
		path: '',
		redirectTo: '/dashboard',
		pathMatch: 'full',
	},
];

@NgModule({
	declarations: [
		AppComponent,
		DashboardComponent,
		GameRoomComponent,
		GameListComponent,
		CreateGameComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		RouterModule.forRoot(appRoutes, {enableTracing: true}),
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
		MatCheckboxModule,
		MatGridListModule,
		MatCardModule,
		MatMenuModule,
		MatIconModule,
		MatButtonModule,
		MatToolbarModule,
		MatPaginatorModule,
		MatSortModule,
		MatDialogModule,
	],
	entryComponents: [CreateGameComponent],
	providers: [RestService],
	bootstrap: [AppComponent],
})
export class AppModule {}
