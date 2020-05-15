import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Game } from '../_models/game/game';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  gameId: string;
  game: Game;
  guessForm = new FormGroup({
    guess: new FormControl('', [Validators.required])
  });
  gameOver: BehaviorSubject<boolean>
  showAlert = false;

  constructor(private api: ApiService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.gameOver = new BehaviorSubject<boolean>(false);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.gameId = params.get('gid');
      this.api.getGame(this.gameId)
        .subscribe(
          data => {
            this.game = data;
            if (this.game.status != 'unfinished') {
              this.gameOver.next(true);
            }
          },
          error => {
            if (error.status == 403) {
              this.router.navigate(['/login']);
            } else if (error.status == 404) {
              this.router.navigate(['/']);
            }
          }
        );
    });
  }

  onSubmit() {
    if (this.guessForm.valid) {
      let guess = this.guessForm.value;
      this.api.makeGuess(this.gameId, guess.guess.toLowerCase())
        .subscribe(
          data => {
            this.game = data;

            if (this.game.status != 'unfinished') {
              this.gameOver.next(true);
            }
            this.showAlert = false;
          },
          error => {
            this.showAlert = true;
          }
        );
    } 
    this.guessForm.reset();
  }
}
