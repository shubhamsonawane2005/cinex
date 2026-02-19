// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, RouterModule, Router } from '@angular/router'; 
// import { FormsModule } from '@angular/forms'; 
// import { MovieService } from '../services/movie'; 

// @Component({
//   selector: 'app-booking',
//   standalone: true,
//   imports: [CommonModule, RouterModule, FormsModule], 
//   templateUrl: './booking.html',
//   styleUrl: './booking.css'
// })
// export class BookingComponent implements OnInit {
  
//   movieTitle: string = ""; 
//   theaterName: string = ""; 
//   selectedSeats: string[] = [];
//   totalPrice: number = 0;
//   ticketPrice: number = 200; 

//   seatsToBook: number = 1; 
//   bookedSeats: string[] = ['A2', 'C5', 'E1']; 

//   times: string[] = ['10:00 PM', '01:00 PM']; 
//   selectedTime: string = '10:00 PM';
//   rows: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
//   seatsPerRow: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
//   private route = inject(ActivatedRoute);
//   private movieService = inject(MovieService);
//   private router = inject(Router);

//   ngOnInit() {
//     this.route.queryParams.subscribe(params => {
//       console.log('Received Params:', params); 

//       if (params['name']) {
//         this.movieTitle = params['name'];
//       }
      
//       // Home page se jo theater aayega wahi save hoga
//       if (params['theater']) {
//         this.theaterName = params['theater'];
//       } else if (!this.theaterName) {
//         this.theaterName = "PVR: Rahul Raj Mall"; 
//       }

//       if (params['time']) {
//         this.selectedTime = params['time'];
//       }

//       const idFromPath = this.route.snapshot.paramMap.get('id') || this.route.snapshot.paramMap.get('movieId');
//       if (idFromPath && !this.movieTitle) {
//         this.movieService.getMovieById(Number(idFromPath)).subscribe(movie => {
//           if (movie) {
//             this.movieTitle = movie.title;
//           }
//         });
//       }
//     });
//   }

//   // YE FUNCTION AB LATEST DATA BHEJEGA
//   goToPayment() {
//     this.router.navigate(['/payment'], {
//       queryParams: {
//         movie: this.movieTitle,
//         price: this.totalPrice,
//         seats: this.selectedSeats.join(', '),
//         time: this.selectedTime,   // Latest selected time
//         theater: this.theaterName  // Latest theater name
//       }
//     });
//   }

//   selectTime(time: string) {
//     this.selectedTime = time; // Time update karne ke liye
//   }

//   toggleSeat(row: string, seatNum: number) {
//     this.selectedSeats = [];
//     for (let i = 0; i < this.seatsToBook; i++) {
//       const currentSeatNum = seatNum + i;
//       const seatId = row + currentSeatNum;
//       if (currentSeatNum <= 9 && !this.isBooked(row, currentSeatNum)) {
//         this.selectedSeats.push(seatId);
//       } else {
//         break; 
//       }
//     }
//     this.totalPrice = this.selectedSeats.length * this.ticketPrice;
//   }

//   isSelected(row: string, seatNum: number): boolean {
//     return this.selectedSeats.includes(row + seatNum);
//   }

//   isBooked(row: string, seatNum: number): boolean {
//     return this.bookedSeats.includes(row + seatNum);
//   }
// }
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 
import { MovieService } from '../services/movie'; 

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], 
  templateUrl: './booking.html',
  styleUrl: './booking.css'
})
export class BookingComponent implements OnInit {
  
  movieTitle: string = ""; 
  theaterName: string = ""; // Default Khali rakho
  selectedSeats: string[] = [];
  totalPrice: number = 0;
  ticketPrice: number = 200; 

  seatsToBook: number = 1; 
  bookedSeats: string[] = ['A2', 'C5', 'E1']; 

  times: string[] = ['10:00 PM', '01:00 PM']; 
  selectedTime: string = '10:00 PM';
  rows: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  seatsPerRow: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private router = inject(Router);

  ngOnInit() {
    // SIRF EK BAR DATA FETCH KARO TAAKI OVERWRITE NA HO
    this.route.paramMap.subscribe(params => {
      const movieId = params.get('movieId');
      const theaterId = params.get('theaterId');
      const timeFromPath = params.get('time');

      const theaterMap: { [key: string]: string } = {
        '1': 'PVR: Rahul Raj Mall',
        '2': 'INOX: VR Mall',
        '3': 'Cinépolis: Imperial Square',
        '4': 'Rajhans Multiplex'
      };

      // ID se naam uthao, agar ID nahi hai toh QueryParams se uthao
      if (theaterId && theaterMap[theaterId]) {
        this.theaterName = theaterMap[theaterId];
      } else {
        // QueryParams backup
        const qTheater = this.route.snapshot.queryParams['theater'];
        this.theaterName = qTheater || "PVR: Rahul Raj Mall"; 
      }

      if (timeFromPath) {
        this.selectedTime = timeFromPath;
      }

      if (movieId) {
        this.movieService.getMovieById(Number(movieId)).subscribe(movie => {
          if (movie) this.movieTitle = movie.title;
        });
      }
    });
  }

  goToPayment() {
    // Navigation se pehle check karo data sahi hai
    console.log("Navigating with Theater:", this.theaterName);
    
    this.router.navigate(['/payment'], {
      queryParams: {
        movie: this.movieTitle,
        price: this.totalPrice,
        seats: this.selectedSeats.join(', '),
        time: this.selectedTime,   
        theater: this.theaterName  
      }
    });
  }

  selectTime(time: string) {
    this.selectedTime = time; 
  }

  toggleSeat(row: string, seatNum: number) {
    this.selectedSeats = [];
    for (let i = 0; i < this.seatsToBook; i++) {
      const currentSeatNum = seatNum + i;
      const seatId = row + currentSeatNum;
      if (currentSeatNum <= 9 && !this.isBooked(row, currentSeatNum)) {
        this.selectedSeats.push(seatId);
      } else {
        break; 
      }
    }
    this.totalPrice = this.selectedSeats.length * this.ticketPrice;
  }

  isSelected(row: string, seatNum: number): boolean {
    return this.selectedSeats.includes(row + seatNum);
  }

  isBooked(row: string, seatNum: number): boolean {
    return this.bookedSeats.includes(row + seatNum);
  }
}