
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

  times: string[] = []; 
  selectedTime: string = ""; 
  selectedDate: string = ""; 

  rows: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  seatsPerRow: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private router = inject(Router);

  ngOnInit() {
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

      if (theaterId && theaterMap[theaterId]) {
        this.theaterName = theaterMap[theaterId];
      } else {
        const qTheater = this.route.snapshot.queryParams['theater'];
        this.theaterName = qTheater || "PVR: Rahul Raj Mall"; 
      }

      if (timeFromPath) {
        const decodedTime = decodeURIComponent(timeFromPath);
        this.selectedTime = decodedTime;
        this.times = [decodedTime]; 
      }

      // Aaj ki date set karna agar query mein na ho
      this.selectedDate = this.route.snapshot.queryParams['date'] || new Date().toISOString().split('T')[0];

      if (movieId) {
        this.movieService.getMovieById(Number(movieId)).subscribe(movie => {
          if (movie) this.movieTitle = movie.title;
        });
      }
    });
  }

  goToPayment() {
    if (this.selectedSeats.length === 0) {
      alert("Bhai, pehle seat toh select kar le!");
      return;
    }

    // Yahan saara data payment page ko transfer ho raha hai
    this.router.navigate(['/payment'], {
      queryParams: {
        movie: this.movieTitle,
        price: this.totalPrice,
        seats: this.selectedSeats.join(', '),
        time: this.selectedTime,   
        theater: this.theaterName,
        date: this.selectedDate 
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