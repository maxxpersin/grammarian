import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { Metadata } from '../_models/metadata/metadata';
import { Defaults } from '../_models/defaults/defaults';
import { Game } from '../_models/game/game';
import { Router } from '@angular/router';
import { User } from '../_models/user/user';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {

  meta: Metadata;
  defaults: Defaults;
  games: Game[] = [];
  closeResult: string;

  newGameForm: FormGroup;

  constructor(private api: ApiService, private authenticationService: AuthenticationService, private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    
    this.api.getMeta().subscribe(
      data => {
        this.meta = data;
        this.defaults = this.authenticationService.currentUserValue.defaults;

        this.newGameForm = new FormGroup({
          wordBackground: new FormControl(this.defaults.colors.wordBackground),
          textBackground: new FormControl(this.defaults.colors.textBackground),
          guessBackground: new FormControl(this.defaults.colors.guessBackground),
          font: new FormControl(this.defaults.font.rule),
          level: new FormControl(this.defaults.level.name)
        });
      },
      error => {
        console.log(error);
      }
    );

    this.api.getGames().subscribe(
      data => {
        this.games = data;
      },
      error => {
        if (error.status == 403) {
          this.router.navigate(['/login']);
        }
      }
    );
  }

  onSubmit() {
    let newGame = this.newGameForm.value;

    this.api.createGame(newGame.level, { guessBackground: newGame.guessBackground, textBackground: newGame.textBackground, wordBackground: newGame.wordBackground }, newGame.font)
    .subscribe(
      data => {
        this.router.navigate([`/game/${data._id}`]);
      },
      error => {
        if (error.status == 403) {
          this.router.navigate(['/login']);
        }
      }
    );
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.onSubmit();
    });
  }

}
