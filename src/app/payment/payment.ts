
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
  
  selectedMethod: string = 'card';
  isUpiVerified: boolean = false;
  convenienceFee: number = 0; 

  // Validation variables
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
      alert('Invalid UPI ID! Please include "@" in your ID.');
    }
  }

  isCardValid(): boolean {
    return this.cardNumber.length === 16 && 
           this.expiry.length === 5 && 
           this.cvv.length === 3;
  }

  async processPayment() {
    // 1. Validation Logic with English Alerts
    if (this.selectedMethod === 'card') {
      if (!this.cardNumber || !this.expiry || !this.cvv) {
        alert('Please fill in all card details before proceeding.');
        return;
      }
      if (!this.isCardValid()) {
        alert('Invalid Details! Card must be 16 digits, Expiry MM/YY, and CVV 3 digits.');
        return;
      }
    }

    if (this.selectedMethod === 'upi' && !this.isUpiVerified) {
      alert('UPI not verified! Please enter your UPI ID and click "Verify" first.');
      return;
    }

    // 2. Booking Data Creation
    const bookingId = 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const bookingData = {
      movieTitle: this.movieTitle,      
      theaterName: this.theaterName,    
      showTime: this.showTime,          
      seats: this.seats,
      totalAmount: this.finalAmount,    
      paymentStatus: this.selectedMethod === 'offline' ? 'Pending' : 'Paid',
      bookingId: bookingId,
      createdAt: new Date()
    };

    // 3. Save to Database
    this.authService.saveBooking(bookingData).subscribe({
      next: (res) => {
        alert('Booking Successful! Your ticket has been saved.');
        this.generatePDF(bookingData); 
        this.router.navigate(['/']);
      },
      error: (err) => alert('Database Error! Unable to save booking.')
    });
  }

  // 4. Professional Movie Ticket PDF Logic
  generatePDF(data: any) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // --- TOP RED HEADER ---
    doc.setFillColor(229, 9, 20); 
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    // CINEX LOGO
    doc.setFontSize(45);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('CINEX', 20, 35);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('PREMIUM MOVIE TICKET', 21, 45);

    // BOOKING ID BADGE (Right Side)
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth - 75, 15, 60, 25, 3, 3, 'F');
    doc.setTextColor(229, 9, 20);
    doc.setFontSize(9);
    doc.text('BOOKING ID', pageWidth - 70, 25);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(data.bookingId, pageWidth - 70, 35);

    // --- MOVIE TITLE ---
    let yPos = 85;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(26);
    doc.text(data.movieTitle.toUpperCase(), 20, yPos);
    
    // RED UNDERLINE
    doc.setDrawColor(229, 9, 20);
    doc.setLineWidth(1.5);
    doc.line(20, yPos + 4, 80, yPos + 4);

    // --- INFO SECTION ---
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

    // --- PAYMENT SUMMARY BOX ---
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
    
    // Status Color: Green for Paid, Red for Pending
    if(data.paymentStatus === 'Paid') {
      doc.setTextColor(34, 139, 34); // Green
    } else {
      doc.setTextColor(229, 9, 20); // Red
    }
    doc.text(data.paymentStatus.toUpperCase(), 65, yPos + 28);

    // --- QR CODE SECTION ---
    yPos += 60;
    const qrSize = 45;
    const qrX = (pageWidth / 2) - (qrSize / 2);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data.bookingId}`;
    
    doc.addImage(qrUrl, 'PNG', qrX, yPos, qrSize, qrSize);
    
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text('SCAN THIS QR AT THE CINEMA ENTRANCE', pageWidth / 2, yPos + qrSize + 8, { align: 'center' });

    // --- DASHED LINE (TICKET CUT) ---
    doc.setLineDashPattern([2, 2], 0);
    doc.setDrawColor(200, 200, 200);
    doc.line(10, 265, pageWidth - 10, 265);

    // --- FOOTER ---
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for booking with Cinex! Enjoy your movie.', pageWidth / 2, 280, { align: 'center' });

    // --- SAVE PDF ---
    doc.save(`Cinex_Ticket_${data.bookingId}.pdf`);
  }
}