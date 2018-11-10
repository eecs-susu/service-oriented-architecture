import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.css']
})
export class SignInFormComponent implements OnInit {
  form = new FormGroup({
    username: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required,
    ])
  });
  isWarningVisible: boolean;
  warningText: string;
  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.hideWarning();
  }

  showWarning(text = null) {
    this.warningText = text;
    this.isWarningVisible = true;
  }

  hideWarning() {
    this.isWarningVisible = false;

  }

  signIn(credentials) {
    this.authService.login({ username: credentials['username'], password: credentials['password'] },
      () => {
        this.hideWarning();
        this.router.navigate(['/game']);
      },
      (e) => {
        try {
          const error = e.error;
          this.showWarning(error.non_field_errors[0]);
        } catch {
          this.showWarning('Unable to login');
        }
      });

  }


  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }

}
