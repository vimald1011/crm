import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLead } from './edit-lead';

describe('EditLead', () => {
  let component: EditLead;
  let fixture: ComponentFixture<EditLead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLead],
    }).compileComponents();

    fixture = TestBed.createComponent(EditLead);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
