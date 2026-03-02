import { Injectable, inject } from '@angular/core';
import { MatDialog , MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Component,Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

// 1. Alert ka UI component service ke andar hi define kar sakte hain
@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title class="alert-title">Alert</h2>
    <mat-dialog-content class="alert-content">{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close class="alertbtn">OK</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .alert-title {
      color: #d32f2f; /* Material Red */
      font-weight: bold;
    }
    .alert-content {
      font-size: 16px;
      padding: 16px 16px;
    }
  `]
})
export class AlertDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}

@Injectable({
  providedIn: 'root'
})
export class DialogAlertService {
  private dialog = inject(MatDialog);

  // 2. Alert dikhane ka main function
  showAlert(message: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      height:'200px',
      data: { message: message }
    });
  }
}