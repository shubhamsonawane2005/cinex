
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
  theaterName: string = ""; 
  selectedSeats: string[] = [];
  totalPrice: number = 0;
  ticketPrice: number = 200; 

  seatsToBook: number = 1; 
  bookedSeats: string[] = ['A2', 'C5', 'E1']; 

  // Inko static rakha hai, par UI mein selection URL wale se match hoga
  times: string[] = ['10:00 AM', '11:00 AM', '01:00 PM', '01:30 PM', '01:45 PM', '02:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:15 PM', '08:15 PM', '09:00 PM', '09:30 AM', '09:45 PM', '10:15 AM', '10:30 PM', '12:45 PM']; 
  selectedTime: string = ""; // Shuru mein khali taaki URL wala value override kare
  
  rows: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  seatsPerRow: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private router = inject(Router);

  ngOnInit() {
    // Path Params se data uthana (movieId, theaterId, time)
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

      // 1. Theater Name set karo ID ke basis par
      if (theaterId && theaterMap[theaterId]) {
        this.theaterName = theaterMap[theaterId];
      } else {
        const qTheater = this.route.snapshot.queryParams['theater'];
        this.theaterName = qTheater || "PVR: Rahul Raj Mall"; 
      }

      // 2. TIME SELECTION FIX: Jo pichle page se select hoke aaya wahi yahan dikhega
      if (timeFromPath) {
        this.selectedTime = decodeURIComponent(timeFromPath);
        
        // Agar ye time hamari list mein nahi hai, toh use list mein add kar do taaki button dikhe
        if (!this.times.includes(this.selectedTime)) {
          this.times.push(this.selectedTime);
        }
      }

      // 3. Movie details fetch karo
      if (movieId) {
        this.movieService.getMovieById(Number(movieId)).subscribe(movie => {
          if (movie) this.movieTitle = movie.title;
        });
      }
    });
  }

  goToPayment() {
    // Payment page par data transfer
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