import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  dialogRef = inject(
    MatDialogRef<ConfirmDialog>
  );

  data = inject(MAT_DIALOG_DATA);

  onCancel() {

    this.dialogRef.close(false);

  }

  onConfirm() {

    this.dialogRef.close(true);

  }
}
