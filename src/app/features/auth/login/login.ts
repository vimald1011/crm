import { Component, inject } from '@angular/core';
import { Auth } from "../../../core/services/auth";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',

  imports: [
    ReactiveFormsModule,
    RouterLink,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],

  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(Auth)

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],

    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {

  if (this.loginForm.invalid) {
    return;
  }

  this.auth.login(
    {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    },

    () => {

      this.router.navigate([
        '/dashboard'
      ]);

    }
  );

}

}