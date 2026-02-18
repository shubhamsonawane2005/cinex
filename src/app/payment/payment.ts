// import { Component, OnInit, inject } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-payment',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './payment.html',
//   styleUrls: ['./payment.css']
// })
// export class PaymentComponent implements OnInit {
  
//   movieTitle: string = '';
//   theaterName: string = '';
//   showTime: string = '';
//   seats: string = '';
//   totalPrice: number = 0;
//   convenienceFee: number = 45;

//   private route = inject(ActivatedRoute);
//   private router = inject(Router);

//   ngOnInit() {
//     this.route.queryParams.subscribe(params => {
//       this.movieTitle = params['movie'] || 'Unknown Movie';
//       this.theaterName = params['theater'] || 'Unknown Theater';
//       this.showTime = params['time'] || '';
//       this.seats = params['seats'] || '';
//       this.totalPrice = Number(params['price']) || 0;
//     });
//   }

//   get finalAmount() {
//     return this.totalPrice + this.convenienceFee;
//   }

//   processPayment() {
//     alert('Payment Successful!');
//     this.router.navigate(['/']); 
//   }
// }

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css'] // Isko array format mein hi rehne diya hai
})
export class PaymentComponent implements OnInit {
  
  movieTitle: string = '';
  theaterName: string = '';
  showTime: string = '';
  seats: string = '';
  totalPrice: number = 0;
  
  // Isko 0 rakha hai taaki extra charge na jude
  convenienceFee: number = 0; 

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    // Ye URL se sara data kheencht hai
    this.route.queryParams.subscribe(params => {
      console.log('Payment Params Received:', params); // Browser Console (F12) mein check karna

      // Booking HTML se jo 'movie', 'theater', 'time' aa raha hai wahi yahan set hoga
      this.movieTitle = params['movie'] || 'Unknown Movie';
      this.theaterName = params['theater'] || 'Unknown Theater';
      this.showTime = params['time'] || '';
      this.seats = params['seats'] || '';
      this.totalPrice = Number(params['price']) || 0;
    });
  }

  get finalAmount() {
    // Total price + Fee (Abhi 0 hai)
    return this.totalPrice + this.convenienceFee;
  }

  processPayment() {
    alert('Payment Successful!');
    this.router.navigate(['/']); 
  }
}