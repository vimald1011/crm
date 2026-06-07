import { Component, inject } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Lead } from '../../../core/services/lead';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';

import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-lead',

  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],

  templateUrl: './add-lead.html',

  styleUrl: './add-lead.css'
})
export class AddLead {

  private leadService = inject(Lead);

  private fb = inject(FormBuilder);

  leadForm = this.fb.group({

    recruiterName: [
      '',
      Validators.required
    ],

    companyName: [
      '',
      Validators.required
    ],

    contactNumber: [
      '',
      [
        Validators.required,
        Validators.minLength(10)
      ]
    ],

    cctc: [
      '',
      Validators.required
    ],

    ectc: [
      '',
      Validators.required
    ],

    jobType: [
      '',
      Validators.required
    ],

    notes: [''],

    status: [
      'Applied',
      Validators.required
    ],

    candidateName: [
      '',
      Validators.required
    ],

    createdDate: [
      new Date().toISOString()
    ],

      followUpDate: [
        ''
    ],

  });

  onSubmit() {

    if (this.leadForm.invalid) {
      return;
    }

    const newLead = {

      id: Date.now(),

      ...this.leadForm.value

    };

    this.leadService.addLead(
      newLead as any
    );

    this.leadForm.reset();

  }

}