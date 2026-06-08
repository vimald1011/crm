import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { signal } from '@angular/core';
import { Loader } from '../../../shared/components/loader/loader';
import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Loader,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private fb = inject(FormBuilder);

  private auth = inject(Auth);

  private router = inject(Router);
  isLoading = signal(false);

  signupForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],

    email: ['', [Validators.required, Validators.email]],

    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSignup() {
    if (this.signupForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    this.auth.signup(
      {
        fullName: this.signupForm.value.fullName!,

        email: this.signupForm.value.email!,

        password: this.signupForm.value.password!,
      },

      () => {
        this.isLoading.set(false);

        this.router.navigate(['/login']);
      },
    );
  }
}
