import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Lead as LeadModel } from '../models/lead.model';

@Injectable({
  providedIn: 'root',
})
export class Lead {

  private http = inject(HttpClient);

  private apiUrl =
  `${environment.apiBaseUrl}/leads`;

  leads = signal<LeadModel[]>([]);

  constructor() { }

  getLeads(search: string = '') {

  let url = this.apiUrl;

  if (search.trim()) {
    url += `?search=${search}`;
  }

  this.http.get<LeadModel[]>(url)
    .subscribe({
      next: (response) => {

        const sortedLeads = response.sort(
          (a, b) =>
            new Date(b.createdDate).getTime() -
            new Date(a.createdDate).getTime()
        );

        this.leads.set(
          sortedLeads
        );

      },
      error: (error) => {
        console.error('Error fetching leads:', error);
      }
    });

}

  addLead(newLead: LeadModel) {

    this.http.post<LeadModel>(
      this.apiUrl,
      newLead
    ).subscribe({
      next: (response) => {

        this.leads.update(currentLeads => [
          ...currentLeads,
          response
        ]);

      },
      error: (error) => {
        console.error('Error adding lead:', error);
      }
    });

  }

  deleteLead(id: number) {

    this.http.delete(
      `${this.apiUrl}/${id}`
    ).subscribe({
      next: () => {

        this.leads.update(currentLeads =>
          currentLeads.filter(
            lead => lead.id !== id
          )
        );

      },
      error: (error) => {
        console.error('Error deleting lead:', error);
      }
    });

  }

  getLeadById(id: number) {

    return this.leads().find(
      lead => lead.id === id
    );

  }

  updateLead(updatedLead: LeadModel) {

    this.http.put<LeadModel>(
      `${this.apiUrl}/${updatedLead.id}`,
      updatedLead
    ).subscribe({
      next: (response) => {

        this.leads.update(currentLeads =>
          currentLeads.map(lead =>

            lead.id === response.id
              ? response
              : lead

          )
        );

      },
      error: (error) => {
        console.error('Error updating lead:', error);
      }
    });

  }
}