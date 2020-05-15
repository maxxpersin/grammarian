import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user/user';
import { ApiService } from './api.service';
import { Game } from '../_models/game/game';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private route: String = '/api/v2';

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(loginCred: any): Observable<User> {
    return this.http.post<User>(`${this.route}/login`, { email: loginCred.email, password: loginCred.password });
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
    return this.http.post<any>(`${this.route}/logout`, null);
  }
}
