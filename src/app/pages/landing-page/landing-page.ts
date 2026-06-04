import { Component } from '@angular/core';

import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-landing-page',

  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule
  ],

  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPage {

}