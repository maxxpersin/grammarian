import { Injectable } from '@angular/core';
import { User } from '../_models/user/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Metadata } from '../_models/metadata/metadata';
import { Font } from '../_models/font/font';
import { Game } from '../_models/game/game';
import { Level } from '../_models/level/level';
import { Colors } from '../_models/colors/colors';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  route: String = '/api/v2';

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService) {
    this.getFonts()
      .subscribe(
        data => {
          let head = document.getElementsByTagName('head')[0];
          data.forEach(font => {
            let link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = font.url;
            head.appendChild(link);
          });
        }
      )
  }

  getMeta(): Observable<Metadata> {
    return this.http.get<Metadata>(`${this.route}/meta`);
  }

  getFonts(): Observable<Font[]> {
    return this.http.get<Font[]>(`${this.route}/meta/fonts`);
  }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.route}/${this.authenticationService.currentUserValue._id}`);
  }

  createGame(level: string, colors: any, font: string): Observable<Game> {
    let headers = new HttpHeaders({ 'X-font': font, 'Content-Type': 'application/json' });

    return this.http.post<Game>(`${this.route}/${this.authenticationService.currentUserValue._id}?level=${level}`, colors, { headers: headers });
  }

  getGame(gid: string): Observable<Game> {
    return this.http.get<Game>(`${this.route}/${this.authenticationService.currentUserValue._id}/${gid}`);
  }

  makeGuess(gid: string, guess: string): Observable<Game> {
    return this.http.post<Game>(`${this.route}/${this.authenticationService.currentUserValue._id}/${gid}/guesses?guess=${guess}`, null);
  }

}
