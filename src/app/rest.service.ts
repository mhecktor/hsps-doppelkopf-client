import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Spiel} from './model/spiel';
import {Observable} from 'rxjs';
import {Hand} from './model/hand';
import { Card } from './model/card';

@Injectable({
	providedIn: 'root',
})
export class RestService {
	constructor(private http: HttpClient) {}

	public getSessions(): Observable<Spiel[]> {
		return this.http.get<Spiel[]>('http://localhost:8080/sessions');
	}

	public createGame(newGame): Observable<Spiel> {
		return this.http.post<Spiel>(
			'http://localhost:8080/sessions',
			newGame,
			{
				headers: {
					'content-type': 'application/json',
				},
			}
		);
	}
	public joinSession(game: Spiel, playerName: string): Observable<boolean> {
		return this.http.post<boolean>(
			`http://localhost:8080/sessions/${game.spielID}/join`,
			playerName
		);
	}

	public startSession(game: Spiel): Observable<Spiel> {
		return this.http.post<Spiel>(
			`http://localhost:8080/sessions/${game.spielID}/start`,
			null
		);
	}

	public getSession(spielID: String): Observable<Spiel> {
		return this.http.get<Spiel>(
			`http://localhost:8080/sessions/${spielID}`
		);
	}

	public getCards(game: Spiel, playerName: String): Observable<Hand> {
		return this.http.get<Hand>(
			`http://localhost:8080/players/${game.spielID}/${playerName}/hand`
		);
	}

	public getStichs(gameId: String, playerName: String): Observable<any> {
		return this.http.get<any>(
			`http://localhost:8080/players/${gameId}/${playerName}/stichs`
		);
	}


	public performDecision(gameId: String, playerName: String, decision: boolean): Observable<any> {
		return this.http.post(
			`http://localhost:8080/players/${gameId}/${playerName}/performDecision`,
			decision
		);
	}

	public playCard(
		gameId: String,
		playerName: String,
		card: Card
	): Observable<any> {
		return this.http.post(
			`http://localhost:8080/players/${gameId}/${playerName}/playCard`,
			card
		);
	}
}
