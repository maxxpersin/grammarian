import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { User } from '../_models/user/user';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  //user: User;
  public showLogout: boolean = false;

  constructor(private api: ApiService, private authenticationService: AuthenticationService, private router: Router) {

  }

  ngOnInit(): void {
    if (this.authenticationService.currentUserValue) {
      this.showLogout = true;
    }
    // this.user = this.api.getUser();

    // if (this.router.url != '/login') {
    //   this.showLogout = true;
    // } else {
    //   this.showLogout = false;
    // }

    // if (!this.user) {
    //   this.router.navigate(['/login']);
    // }

  }

  logout() {
    this.authenticationService.logout()
      .subscribe(
        data => {
          localStorage.removeItem('user');
          
          this.router.navigate(['/login']);
        },
        error => {
          console.log(error);
        }
      )
  }

}
