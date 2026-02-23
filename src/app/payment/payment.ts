
import { Component, OnInit, inject } from '@angular/core';
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
  styleUrls: ['./payment.css']
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

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.movieTitle = params['movie'] || 'Unknown Movie';
      this.theaterName = params['theater'] || 'Unknown Theater';
      this.showTime = params['time'] || ''; 
      this.seats = params['seats'] || '';
      this.totalPrice = Number(params['price']) || 0;
      this.showDate = params['date'] || new Date().toISOString().split('T')[0];
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

    if (!userEmail) {
      alert("Session expired! Please Login again.");
      this.router.navigate(['/login']);
      return;
    }

    const bookingData = {
      movieTitle: this.movieTitle,      
      userEmail: userEmail, 
      theaterName: this.theaterName,    
      showTime: this.showTime,          
      showDate: this.showDate,
      seats: this.seats,
      totalAmount: this.finalAmount,    
      paymentStatus: this.selectedMethod === 'offline' ? 'Pending' : 'Paid',
      bookingId: bookingId,
      createdAt: new Date()
    };

    console.log("Data being sent to DB:", bookingData); // Check this in F12 Console

    this.authService.saveBooking(bookingData).subscribe({
      next: (res: any) => {
        console.log("Server Success Response:", res);
        alert('Booking Successful! Ticket saved to your profile.');
        this.generatePDF(bookingData); 
        setTimeout(() => {
            this.router.navigate(['/profile']);
        }, 1000);
      },
      error: (err: any) => {
        console.error("Critical Save Error:", err);
        alert('Database Error! Terminal check karo.');
      }
    });
  }

  generatePDF(data: any) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFillColor(229, 9, 20); 
    doc.rect(0, 0, pageWidth, 60, 'F');
    doc.setFontSize(45);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('CINEX', 20, 35);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('PREMIUM MOVIE TICKET', 21, 45);

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth - 75, 15, 60, 25, 3, 3, 'F');
    doc.setTextColor(229, 9, 20);
    doc.setFontSize(9);
    doc.text('BOOKING ID', pageWidth - 70, 25);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(data.bookingId, pageWidth - 70, 35);

    let yPos = 85;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(26);
    doc.text(data.movieTitle.toUpperCase(), 20, yPos);
    
    doc.setDrawColor(229, 9, 20);
    doc.setLineWidth(1.5);
    doc.line(20, yPos + 4, 80, yPos + 4);

    yPos += 25;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('THEATER', 20, yPos);
    doc.text('SHOW TIME', 85, yPos);
    doc.text('SEATS', 150, yPos);

    yPos += 8;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(data.theaterName, 20, yPos);
    doc.text(data.showTime, 85, yPos);
    doc.text(data.seats, 150, yPos);

    yPos += 25;
    doc.setFillColor(248, 248, 248);
    doc.roundedRect(15, yPos, pageWidth - 30, 40, 4, 4, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Total Amount:', 25, yPos + 15);
    doc.text('Payment Status:', 25, yPos + 28);
    
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rs. ${data.totalAmount}.00`, 65, yPos + 15);
    doc.text(data.paymentStatus.toUpperCase(), 65, yPos + 28);

    yPos += 60;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data.bookingId}`;
    doc.addImage(qrUrl, 'PNG', (pageWidth/2)-22, yPos, 45, 45);

    doc.save(`Cinex_Ticket_${data.bookingId}.pdf`);
  }
}