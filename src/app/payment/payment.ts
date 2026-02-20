
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

  // 4. Professional PDF Generation Logic
  generatePDF(data: any) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Red Header Block
    doc.setFillColor(229, 9, 20); 
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    // Logo
    doc.setFontSize(40);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('CINEX', 20, 32);
    
    // Header Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Order Summary', pageWidth - 70, 22);
    doc.text(`Booking ID: ${data.bookingId}`, pageWidth - 70, 32);

    let yPos = 70;
    
    // Labels
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150); 
    doc.text('Theater & Show', 20, yPos);
    doc.text('Payment Method', 80, yPos);
    doc.text('Order Totals', 140, yPos);

    yPos += 10;
    
    // Values
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(data.theaterName, 20, yPos); 
    doc.setFont('helvetica', 'normal');
    doc.text(data.showTime, 20, yPos + 7); 
    doc.text(data.paymentStatus === 'Paid' ? 'Online Payment' : 'Pay at Counter', 80, yPos);

    // Bill Details
    doc.setFontSize(10);
    doc.text(`Subtotal: Rs. ${data.totalAmount}`, 140, yPos);
    doc.text(`Conv. Fee: Rs. 0.00`, 140, yPos + 7);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Grand Total: Rs. ${data.totalAmount}`, 140, yPos + 18);

    yPos += 45;

    // Movie Details Card (Rounded Box)
    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(15, yPos, pageWidth - 30, 55, 5, 5);
    
    yPos += 18;
    doc.setFontSize(16);
    doc.setTextColor(229, 9, 20); 
    doc.text(data.movieTitle, 25, yPos);
    
    yPos += 12;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(`Seats: ${data.seats}`, 25, yPos);
    yPos += 8;
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 25, yPos);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);
    doc.text('Enjoy your movie! Please carry this PDF at the entrance.', pageWidth / 2, 285, { align: 'center' });

    doc.save(`Cinex_Ticket_${data.bookingId}.pdf`);
  }
}