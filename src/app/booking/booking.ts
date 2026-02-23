
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
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private router = inject(Router);

  movieTitle: string = ""; 
  theaterName: string = ""; 
  selectedSeats: string[] = [];
  totalPrice: number = 0;
  ticketPrice: number = 200; 

  seatsToBook: number = 2; 
  bookedSeats: string[] = ['A2', 'C5', 'E1']; 
  times: string[] = []; 
  selectedTime: string = ""; 
  selectedDate: string = ""; 

  rows: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  seatsPerRow: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const movieId = params.get('movieId');
      const theaterId = params.get('theaterId');
      const timeFromPath = params.get('time');

      const theaterMap: Record<string, string> = {
        '1': 'PVR: Rahul Raj Mall',
        '2': 'INOX: VR Mall',
        '3': 'Cinépolis: Imperial Square',
        '4': 'Rajhans Multiplex'
      };

      if (theaterId && theaterMap[theaterId]) {
        this.theaterName = theaterMap[theaterId];
      } else {
        this.theaterName = this.route.snapshot.queryParams['theater'] || "PVR: Rahul Raj Mall"; 
      }

      if (timeFromPath) {
        this.selectedTime = decodeURIComponent(timeFromPath);
        this.times = [this.selectedTime]; 
      }

      this.selectedDate = this.route.snapshot.queryParams['date'] || new Date().toISOString().split('T')[0];

      if (movieId) {
        this.movieService.getMovieById(Number(movieId)).subscribe(movie => {
          if (movie) this.movieTitle = movie.title;
        });
      }
    });
  }

  // --- SMART DYNAMIC SELECTION LOGIC (FIXED) ---
  toggleSeat(row: string, seatNum: number) {
    const seatId = `${row}${seatNum}`;
    
    if (this.selectedSeats.includes(seatId)) {
      this.selectedSeats = [];
      this.totalPrice = 0;
      return;
    }

    const newSelection: string[] = [];
    let currentSeat = seatNum;

    // FIX: Jab tak hamesha 'seatsToBook' ke barabar seat na mil jaye tab tak dhundo
    // 'break' ki jagah hum 'continue' ya loop flow change karenge
    while (newSelection.length < this.seatsToBook && currentSeat <= 9) {
      if (!this.isBooked(row, currentSeat)) {
        newSelection.push(`${row}${currentSeat}`);
      }
      currentSeat++; // Agli seat par jao (Booked ho toh bhi skip karo)
    }

    // Agar aage seats khatam ho gayi aur count pura nahi hua, toh peeche ki seats check karo
    if (newSelection.length < this.seatsToBook) {
        let backSeat = seatNum - 1;
        while (newSelection.length < this.seatsToBook && backSeat >= 1) {
            if (!this.isBooked(row, backSeat) && !newSelection.includes(`${row}${backSeat}`)) {
                newSelection.unshift(`${row}${backSeat}`);
            }
            backSeat--;
        }
    }

    this.selectedSeats = newSelection;
    this.totalPrice = this.selectedSeats.length * this.ticketPrice;
  }

  isSelected(row: string, seatNum: number): boolean {
    return this.selectedSeats.includes(row + seatNum);
  }

  isBooked(row: string, seatNum: number): boolean {
    return this.bookedSeats.includes(row + seatNum);
  }

  selectTime(time: string) {
    this.selectedTime = time; 
  }

  goToPayment() {
    if (this.selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }

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
}