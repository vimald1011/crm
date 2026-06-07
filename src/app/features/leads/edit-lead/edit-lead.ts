import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Lead as LeadModel } from '../../../core/models/lead.model';
import { Lead as LeadService } from "../../../core/services/lead";
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-edit-lead',
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './edit-lead.html',
  styleUrl: './edit-lead.css',
})
export class EditLead {
  private fb = inject(FormBuilder);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private leadService = inject(LeadService);

  leadId = Number(
    this.route.snapshot.paramMap.get('id')
  );

  currentLead = this.leadService.getLeadById(
    this.leadId
  );

  editForm = this.fb.group({

    recruiterName: [
      this.currentLead?.recruiterName || '',
      Validators.required
    ],

    companyName: [
      this.currentLead?.companyName || '',
      Validators.required
    ],

    contactNumber: [
      this.currentLead?.contactNumber || '',
      Validators.required
    ],

    cctc: [
      this.currentLead?.cctc || '',
      Validators.required
    ],

    ectc: [
      this.currentLead?.ectc || '',
      Validators.required
    ],

    jobType: [
      this.currentLead?.jobType || '',
      Validators.required
    ],

    status: [
      this.currentLead?.status || 'Applied',
      Validators.required
    ],

    candidateName: [
      '',
      Validators.required
    ],

    createdDate: [
      this.currentLead?.createdDate || ''
    ],

    followUpDate: [
      this.currentLead?.followUpDate || ''
    ],

    notes: [
      this.currentLead?.notes || ''
    ]

  });

  onSubmit() {

    if (this.editForm.invalid) {
      return;
    }

    const updatedLead = {

      id: this.leadId,

      ...this.editForm.value

    } as LeadModel;

    this.leadService.updateLead(
      updatedLead
    );

    this.router.navigate(['/dashboard']);

  }
}
