import { Component, computed, inject, OnInit, Pipe, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Lead } from '../../../core/services/lead';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-dashboard-home',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatChipsModule,
    DatePipe
  ],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css',
})
export class DashboardHome implements OnInit {

  searchText = signal('');
  selectedStatus = signal('');
  selectedJobType = signal('');
  private leadService = inject(Lead);
  private dialog = inject(MatDialog);
  private auth = inject(Auth);

  ngOnInit(): void {
    this.leadService.getLeads();
  }

  currentUser = this.auth.currentUser;

  filteredLeads = computed(() => {

  return this.leads().filter(lead => {

    const matchesSearch =

      lead.recruiterName
        .toLowerCase()
        .includes(
          this.searchText().toLowerCase()
        )

      ||

      lead.companyName
        .toLowerCase()
        .includes(
          this.searchText().toLowerCase()
        );

    const matchesJobType =

      !this.selectedJobType()

      ||

      lead.jobType === this.selectedJobType()
      
      ||

      lead.candidateName
      .toLowerCase()
      .includes(
        this.searchText().toLowerCase()
      );

      const matchesStatus =

  !this.selectedStatus()

  ||

  lead.status === this.selectedStatus();

    return (
  matchesSearch &&
  matchesJobType &&
  matchesStatus
);

  });

});

  totalLeads = computed(() => {

  return this.leads().length;

});

totalCompanies = computed(() => {

  const companies = new Set(

    this.leads().map(
      lead => lead.companyName
    )

  );

  return companies.size;

});

remoteJobs = computed(() => {

  return this.leads().filter(
    lead => lead.jobType === 'Remote'
  ).length;

});

highestECTC = computed(() => {

  if (this.leads().length === 0) {
    return 0;
  }

  return Math.max(

    ...this.leads().map(
      lead => Number(lead.ectc)
    )

  );

});

upcomingFollowUps = computed(() => {

  return this.leads().filter(lead =>

    lead.followUpDate

  );

});

  leads = this.leadService.leads;

  deleteLead(id: number) {

    const dialogRef = this.dialog.open(
      ConfirmDialog
    );

    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        this.leadService.deleteLead(id);

      }

    });

  }

  logout() {
    this.auth.logout();
  }
}
