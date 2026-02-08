import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router, RouterLink } from '@angular/router'; // Added Router
import { MovieService, Movie } from '../services/movie';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css'
})
export class MovieDetailsComponent implements OnInit {

  movie: Movie | undefined;
  selectedTheater: number | null = null;
  selectedTime: string | null = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router); // Inject Router for navigation
  private movieService = inject(MovieService);

  cast = [
    { name: 'Cillian Murphy', role: 'Oppenheimer', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Cillian_Murphy_Press_Conference_The_Party_Berlinale_2017_02cr.jpg' },
    { name: 'Robert Downey Jr.', role: 'Lewis Strauss', image: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg' },
    { name: 'Emily Blunt', role: 'Kitty', image: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Emily_Blunt_by_Gage_Skidmore_2.jpg' },
    { name: 'Matt Damon', role: 'Leslie Groves', image: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Damon_Matt_2009_Venice_Film_Festival.jpg' },
    { name: 'Florence Pugh', role: 'Jean Tatlock', image: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Florence_Pugh_SDCC_2019.jpg' }
  ];

  // Dates
  dates = [
    { day: '11', month: 'OCT', weekday: 'TODAY', active: true },
    { day: '12', month: 'OCT', weekday: 'TOMORROW', active: false },
    { day: '13', month: 'OCT', weekday: 'FRI', active: false },
    { day: '14', month: 'OCT', weekday: 'SAT', active: false }
  ];

  // Theaters Data (Integrated from previous component)
  theaters = [
    {
      id: 1,
      name: 'PVR: Rahul Raj Mall',
      address: 'Piplod, Dumas Road, Surat',
      timings: ['10:00 AM', '01:30 PM', '05:00 PM', '09:00 PM'],
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=PVR+Rahul+Raj+Mall+Surat'
    },
    {
      id: 2,
      name: 'INOX: VR Mall',
      address: 'Dumas Road, Magdalla, Surat',
      timings: ['11:00 AM', '02:00 PM', '06:15 PM', '10:30 PM'],
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=INOX+VR+Mall+Surat'
    },
    {
      id: 3,
      name: 'Cinépolis: Imperial Square',
      address: 'Adajan Gam, Surat',
      timings: ['09:30 AM', '12:45 PM', '04:30 PM', '08:15 PM'],
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cinepolis+Imperial+Square+Mall+Surat'
    },
    {
      id: 4,
      name: 'Rajhans Multiplex',
      address: 'Pal Hazira Road, Adajan, Surat',
      timings: ['10:15 AM', '01:45 PM', '05:30 PM', '09:45 PM'],
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rajhans+Cinema+Pal+Adajan+Surat'
    }
  ];

  similarMovies: Movie[] = [];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadMovie(id);
      }
    });
  }

  loadMovie(id: number) {
    this.movieService.getMovieById(id).subscribe(data => {
      this.movie = data;
    });

    this.movieService.getMovies().subscribe(data => {
      this.similarMovies = data.filter(m => m.id !== id);
    });
  }

  proceedToBooking() {
    // Check if we have a movie, a theater, and a time selected
    if (this.movie && this.selectedTheater && this.selectedTime) {

      // Navigate using the pattern: /booking/movieId/theaterId/time
      this.router.navigate([
        '/booking',
        this.movie.id,
        this.selectedTheater,
        this.selectedTime
      ]);

    } else {
      // Alert the user if they haven't picked a time slot yet
      alert('Please select a theater and a showtime first.');

      // Optional: Scroll them down to the booking section if they haven't picked
      this.scrollToBooking();
    }
  }

  selectDate(index: number) {
    this.dates.forEach(d => d.active = false);
    this.dates[index].active = true;
    // Optional: Reset time selection when date changes
    this.selectedTime = null;
    this.selectedTheater = null;
  }

  selectTime(time: string, theaterId: number) {
    this.selectedTime = time;
    this.selectedTheater = theaterId;

    // Trigger Navigation to Seat Booking
    console.log(`Booking ${this.movie?.title} at Theater ${theaterId} for ${time}`);

    // Example: Navigate to a seat booking page (You'll need to create this later)
    // this.router.navigate(['/seat-booking', this.movie?.id, theaterId, time]);

    // For now, just an alert to show it works
    // alert(`Redirecting to Seat Selection for ${time} at Theater ID: ${theaterId}`);
  }

  scrollToBooking() {
    const element = document.getElementById('booking-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}