

// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, RouterModule } from '@angular/router'; 
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
  
//   movieTitle: string = ""; // Default khali rakha hai taaki "Loading..." na dikhe
//   theaterName: string = "PVR: Rahul Raj Mall"; 
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

//   ngOnInit() {
//     // URL ke queryParams se data uthao
//     this.route.queryParams.subscribe(params => {
//       console.log('Received Params:', params); 

//       if (params['name']) {
//         this.movieTitle = params['name'];
//       }
      
//       if (params['theater']) {
//         this.theaterName = params['theater'];
//       }

//       if (params['time']) {
//         this.selectedTime = params['time'];
//       }

//       // BACKUP: Agar movieTitle khali hai toh ID se fetch karo
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

//   selectTime(time: string) {
//     this.selectedTime = time;
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
import { ActivatedRoute, RouterModule } from '@angular/router'; 
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
  theaterName: string = "PVR: Rahul Raj Mall"; 
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

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log('Received Params:', params); 

      if (params['name']) {
        this.movieTitle = params['name'];
      }
      
      if (params['theater']) {
        this.theaterName = params['theater'];
      }

      if (params['time']) {
        this.selectedTime = params['time'];
      }

      // Backup logic for movie title
      const idFromPath = this.route.snapshot.paramMap.get('id') || this.route.snapshot.paramMap.get('movieId');
      if (idFromPath && !this.movieTitle) {
        this.movieService.getMovieById(Number(idFromPath)).subscribe(movie => {
          if (movie) {
            this.movieTitle = movie.title;
          }
        });
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