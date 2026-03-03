import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css'],
})
export class PaymentComponent implements OnInit {
  movieTitle: string = '';
  theaterName: string = '';
  showTime: string = '';
  seats: string = '';
  totalPrice: number = 0;
  showDate: string = '';

  selectedMethod: string = 'card';
  isUpiVerified: boolean = false;
  convenienceFee: number = 0;

  cardNumber: string = '';
  expiry: string = '';
  cvv: string = '';
  upiId: string = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.movieTitle = params['movie'] || 'Unknown Movie';
      this.theaterName = params['theater'] || 'Unknown Theater';
      this.showTime = params['time'] || '';
      this.seats = params['seats'] || '';
      this.totalPrice = Number(params['price']) || 0;
      // console.log("Received Params:", params);
      // this.showDate = params['date'] || new Date().toISOString().split('T')[0];
      if (params['date']) {
        this.showDate = params['date'];
      } else {
        this.showDate = new Date().toISOString().split('T')[0];
        console.warn('Date missing in URL, using current date.');
      }
      this.cdr.detectChanges();
    });
  }

  get finalAmount() {
    return this.totalPrice + this.convenienceFee;
  }

  setPaymentMethod(method: string) {
    this.selectedMethod = method;
    this.isUpiVerified = false;
  }

  verifyUPI() {
    if (this.upiId.includes('@')) {
      this.isUpiVerified = true;
      alert('UPI Verified successfully!');
    } else {
      alert('Invalid UPI ID!');
    }
  }

  isCardValid(): boolean {
    return this.cardNumber.length === 16 && this.expiry.length === 5 && this.cvv.length === 3;
  }

  async processPayment() {
    if (this.selectedMethod === 'card' && !this.isCardValid()) {
      alert('Please fill correct card details!');
      return;
    }

    if (this.selectedMethod === 'upi' && !this.isUpiVerified) {
      alert('Please verify UPI first!');
      return;
    }

    const bookingId = 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName') || 'Customer';

    if (!userEmail) {
      alert('Session expired! Please Login again.');
      this.router.navigate(['/login']);
      return;
    }

    const status = this.selectedMethod === 'offline' ? 'Pending' : 'Paid';
    const bookingData = {
      movieTitle: this.movieTitle,
      theaterName: this.theaterName,
      userEmail: userEmail,
      userName: userName,
      showTime: this.showTime,
      showDate: this.showDate,
      seats: Array.isArray(this.seats) ? this.seats.join(', ') : String(this.seats),
      totalAmount: this.finalAmount,
      paymentStatus: status,
      bookingId: bookingId,
    };

    console.log('Final data to Backend:', bookingData);

    this.authService.saveBooking(bookingData).subscribe({
      next: (res: any) => {
        const message =
          this.selectedMethod === 'offline'
            ? 'Booking Confirmed! Please pay at the cinema.'
            : 'Payment Successful! Ticket is generating...';

        alert(message);

        this.generatePDF(bookingData, () => {
          this.router.navigate(['/']);
        });
      },
      error: (err: any) => {
        console.error('Backend Error:', err);
        // Error message agar backend se aa raha hai toh use print karein
        const errMsg = err.error?.message || 'Database connection failed';
        alert(`Error: ${errMsg}`);
      },
    });
  }

  generatePDF(data: any, onComplete: () => void) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Red Header
    doc.setFillColor(229, 9, 20);
    doc.rect(0, 0, pageWidth, 50, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(40);
    doc.text('CINEX', 20, 35);

    // Ticket Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(22);
    doc.text(data.movieTitle.toUpperCase(), 20, 70);

    doc.setFontSize(12);
    doc.text(`Theater: ${data.theaterName}`, 20, 85);

    doc.text(`Date: ${data.showDate}`, 20, 95);
    doc.text(`Time: ${data.showTime}`, 80, 95);
    doc.text(`Seats: ${data.seats}`, 140, 95);

    doc.setFontSize(14);
    doc.text(`Booking ID: ${data.bookingId}`, 20, 115);
    doc.text(`Total Paid: Rs. ${data.totalAmount}`, 20, 125);
    doc.setFontSize(12);
    doc.setTextColor(data.paymentStatus === 'Pending' ? 255 : 0, 0, 0); // Red color for Pending
    doc.text(`Status: ${data.paymentStatus}`, 20, 132);
    doc.setTextColor(0, 0, 0);

    // QR Code
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data.bookingId}`;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = qrUrl;

    img.onload = () => {
      doc.addImage(img, 'PNG', pageWidth / 2 - 25, 140, 50, 50);
      doc.save(`Cinex_${data.bookingId}.pdf`);
      onComplete();
    };

    img.onerror = () => {
      console.warn('QR code failed to load, saving PDF without it.');
      doc.save(`Cinex_${data.bookingId}.pdf`);
      onComplete();
    };
  }
}
