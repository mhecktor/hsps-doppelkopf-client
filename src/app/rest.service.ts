import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) {

  }

  public getSessions() {
    return this.http.get('http://localhost:8080/sessions');
  }

  createGame(newGame): any {
    return this.http.post('http://localhost:8080/sessions', newGame, {
      headers: {
        'content-type': 'application/json'
      }
    });
	}
}
