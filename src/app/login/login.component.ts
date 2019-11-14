import { Component, OnInit } from '@angular/core';
import { LoginService } from '../shared/login.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user = {
    login: '',
    password: ''
  };

  constructor(private service: LoginService, private router: Router) {}

  ngOnInit() {}

  onSubmit(user: NgForm) {
    this.service.login(user.value).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['warehouse']);
        // link
      },
      err => {
        if (err.status === 400) {
          console.log('Incorrect username or password.');
        } else {
          console.log(err);
        }
      }
    );
    console.log(user.value);
  }
}
