import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { jsPDF } from 'jspdf'; 
import { AuthService } from '../services/auth.service';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class PaymentComponent implements OnInit {
  movieTitle: string = '';
  theaterName: string = '';
  showTime: string = '';
  seats: string = '';
  totalPrice: number = 0;
  selectedMethod: string = 'card';
  isUpiVerified: boolean = false;
  convenienceFee: number = 0;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService)

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.movieTitle = params['movie'] || 'Unknown Movie';
      this.theaterName = params['theater'] || 'Unknown Theater';
      this.showTime = params['time'] || '';
      this.seats = params['seats'] || '';
      this.totalPrice = Number(params['price']) || 0;
    });
  }

  get finalAmount() { return this.totalPrice + this.convenienceFee; }

  setPaymentMethod(method: string) {
    this.selectedMethod = method;
    this.isUpiVerified = false;
  }

  verifyUPI() { this.isUpiVerified = true; }

  // Simple Validation Logic
  isCardValid(): boolean {
    // Sirf demo ke liye length check kar rahe hain
    return true; 
  }

  async processPayment() {
    const bookingId = 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const bookingData = {
    movieTitle: this.movieTitle,      // movie -> movieTitle
    theaterName: this.theaterName,    // theater -> theaterName
    showTime: this.showTime,          // time -> showTime
    seats: this.seats,
    totalAmount: this.finalAmount,    // amount -> totalAmount
    paymentStatus: this.selectedMethod === 'offline' ? 'Pending' : 'Paid',
    bookingId: bookingId,
    createdAt: new Date()
  };
    // 1. Validation check
    if (this.selectedMethod === 'card' && !this.isCardValid()) {
      alert('Invalid Card Details!');
      return;
    }

    // 2. Save to MongoDB via Service
    this.authService.saveBooking(bookingData).subscribe({
      next: (res) => {
        alert('Booking Successful & Saved to DB!');
        this.generatePDF(bookingData); // 3. PDF Generate karein
        this.router.navigate(['/']);
      },
      error: (err) => alert('Database Error!')
    });
  }

  generatePDF(data: any) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // --- 1. Header Section ---
  doc.setFillColor(229, 9, 20); // Cinex Red
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setFontSize(30);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('CINEX', 20, 28);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Order Summary', pageWidth - 60, 20);
  doc.text(`Booking ID: ${data.bookingId}`, pageWidth - 60, 28);

  // --- 2. Information Grid ---
  let yPos = 55;
  
  // Labels
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Theater & Show', 20, yPos);
  doc.text('Payment Method', 80, yPos);
  doc.text('Order Totals', 140, yPos);

  // Values
  yPos += 8;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  
  // Theater Info
  doc.text(data.theaterName, 20, yPos);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.showTime, 20, yPos + 6);

  // Payment Info
  doc.text(data.paymentStatus === 'Paid' ? 'Online Payment' : 'Pay at Counter', 80, yPos);

  // Amount Summary Box
  doc.setFontSize(10);
  doc.text(`Subtotal: Rs. ${data.totalAmount - 30}`, 140, yPos); // Example fee math
  doc.text(`Conv. Fee: Rs. 30.00`, 140, yPos + 6);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grand Total: Rs. ${data.totalAmount}`, 140, yPos + 15);

  // --- 3. Movie Details Section (The "Delivered" look) ---
  yPos += 35;
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(15, yPos, pageWidth - 30, 45, 3, 3);
  
  yPos += 15;
  doc.setFontSize(14);
  doc.setTextColor(229, 9, 20);
  doc.text(data.movieTitle, 25, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text(`Seats: ${data.seats}`, 25, yPos);
  doc.text(`Date: ${new Date(data.createdAt).toLocaleDateString()}`, 25, yPos + 7);

  // --- 4. Footer ---
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Enjoy your movie! Please carry this PDF or show the Booking ID at the entrance.', pageWidth / 2, 280, { align: 'center' });

  doc.save(`Cinex_Ticket_${data.bookingId}.pdf`);
}
}