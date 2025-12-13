import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {CookieService} from 'ngx-cookie-service'

@Component({
  selector: 'app-login-success',
  imports: [],
  templateUrl: './login-success.html',
  styleUrl: './login-success.css',
})
export class LoginSuccess {

  constructor(private cookieService: CookieService,
    private router: Router
  ){}

  ngOnInit() {

    const token = this.cookieService.get('access_token');
      sessionStorage.setItem('token',token)
      this.router.navigate(['/dashboard'])
    
  }
}
