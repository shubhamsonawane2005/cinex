import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class PaymentComponent {
  router = inject(Router);

  processPayment() {
    alert('Payment Successful! Ticket Booked.');
    this.router.navigate(['/']); // Go back to Home
  }
}