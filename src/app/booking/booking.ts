import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router'; 
import { MovieService } from '../services/movie'; // Import Service

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css'
})
export class BookingComponent implements OnInit {
  
  movieTitle: string = "";
  selectedSeats: string[] = [];
  totalPrice: number = 0;
  ticketPrice: number = 200; 

  // 1. Define Available Times
  times: string[] = ['10:00 PM', '01:00 PM']; 
  
  // 2. Track Selected Time (Default to the first one)
  selectedTime: string = '10:00 PM';
  // Rows A to J
  rows: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  // Seats 1 to 9
  seatsPerRow: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  selectTime(time: string) {
    this.selectedTime = time;
  }
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    // Fetch the real movie name
    if (id) {
      this.movieService.getMovieById(id).subscribe(movie => {
        if (movie) {
          this.movieTitle = movie.title;
        }
      });
    }
  }

  toggleSeat(row: string, seatNum: number) {
    const seatId = row + seatNum;
    if (this.selectedSeats.includes(seatId)) {
      this.selectedSeats = this.selectedSeats.filter(s => s !== seatId);
    } else {
      this.selectedSeats.push(seatId);
    }
    this.totalPrice = this.selectedSeats.length * this.ticketPrice;
  }

  isSelected(row: string, seatNum: number): boolean {
    return this.selectedSeats.includes(row + seatNum);
  }
}