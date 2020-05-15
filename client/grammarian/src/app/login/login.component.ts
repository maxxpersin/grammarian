import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  showAlert = false;

  constructor(private api: ApiService, private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authenticationService.login(this.loginForm.value)
        .subscribe(
          data => {
            this.authenticationService.currentUserSubject.next(data);
            localStorage.setItem('user', JSON.stringify(data));
            this.router.navigate(['']);
          },
          error => {
            if (error.status >= 400 && error.status < 500) {
              this.showAlert = true;
            }
          }
        );
    } else {
      this.showAlert = true;
    }
  }
}
