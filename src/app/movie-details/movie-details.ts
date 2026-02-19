// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, RouterModule, Router } from '@angular/router'; // Added Router
// import { MovieService, Movie } from '../services/movie';

// @Component({
//   selector: 'app-movie-details',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './movie-details.html',
//   styleUrl: './movie-details.css'
// })
// export class MovieDetailsComponent implements OnInit {

//   movie: Movie | undefined;
//   selectedTheater: number | null = null;
//   selectedTime: string | null = null;

//   private route = inject(ActivatedRoute);
//   private router = inject(Router); // Inject Router for navigation
//   private movieService = inject(MovieService);
//   dates: any[] = [];
//   similarMovies: Movie[] = [];

//   cast = [
//     { name: 'Cillian Murphy', role: 'Oppenheimer', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Cillian_Murphy_Press_Conference_The_Party_Berlinale_2017_02cr.jpg' },
//     { name: 'Robert Downey Jr.', role: 'Lewis Strauss', image: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg' },
//     { name: 'Emily Blunt', role: 'Kitty', image: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Emily_Blunt_by_Gage_Skidmore_2.jpg' },
//     { name: 'Matt Damon', role: 'Leslie Groves', image: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Damon_Matt_2009_Venice_Film_Festival.jpg' },
//     { name: 'Florence Pugh', role: 'Jean Tatlock', image: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Florence_Pugh_SDCC_2019.jpg' }
//   ];


//   ngOnInit() {
//     // 1. Generate live dates first
//     this.generateLiveDates();

//     // 2. Load movie data
//     this.route.paramMap.subscribe(params => {
//       const id = Number(params.get('id'));
//       if (id) {
//         this.loadMovie(id);
//       }
//     });
//   }
//   generateLiveDates() {
//     const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
//     const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

//     const tempDates = [];

//     for (let i = 0; i < 7; i++) {
//       const d = new Date();
//       d.setDate(d.getDate() + i);

//       let weekdayLabel = dayNames[d.getDay()];
//       if (i === 0) weekdayLabel = 'TODAY';
//       if (i === 1) weekdayLabel = 'TOMORROW';

//       tempDates.push({
//         day: d.getDate().toString().padStart(2, '0'),
//         month: monthNames[d.getMonth()],
//         weekday: weekdayLabel,
//         active: i === 0,
//         fullDate: d
//       });
//     }
//     this.dates = tempDates;
//   }

//   // Booking time 
//   isTimePassed(timeStr: string): boolean {
    
//   // 1. Find the currently active date card
//   const activeDate = this.dates.find(d => d.active);
  
//   // 2. If the selected date is NOT "TODAY", all shows are available
//   if (!activeDate || activeDate.weekday !== 'TODAY') {
//     return false;
//   }

//   // 3. Convert time string (e.g., "01:30 PM") to a 24-hour Date object
//   const now = new Date();
//   const [time, modifier] = timeStr.split(' ');
//   let [hours, minutes] = time.split(':').map(Number);

//   if (modifier === 'PM' && hours < 12) hours += 12;
//   if (modifier === 'AM' && hours === 12) hours = 0;

//   const showTime = new Date();
//   showTime.setHours(hours, minutes, 0, 0);

//   // 4. Compare: If showTime is before now, it's passed
//   return showTime < now;
// }


//   // Theaters Data (Integrated from previous component)
//   theaters = [
//     {
//       id: 1,
//       name: 'PVR: Rahul Raj Mall',
//       address: 'Piplod, Dumas Road, Surat',
//       timings: ['10:00 AM', '01:30 PM', '05:00 PM', '09:00 PM'],
//       mapUrl: 'https://www.google.com/maps/search/?api=1&query=PVR+Rahul+Raj+Mall+Surat'
//     },
//     {
//       id: 2,
//       name: 'INOX: VR Mall',
//       address: 'Dumas Road, Magdalla, Surat',
//       timings: ['11:00 AM', '02:00 PM', '06:15 PM', '10:30 PM'],
//       mapUrl: 'https://www.google.com/maps/search/?api=1&query=INOX+VR+Mall+Surat'
//     },
//     {
//       id: 3,
//       name: 'Cinépolis: Imperial Square',
//       address: 'Adajan Gam, Surat',
//       timings: ['09:30 AM', '12:45 PM', '04:30 PM', '08:15 PM'],
//       mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cinepolis+Imperial+Square+Mall+Surat'
//     },
//     {
//       id: 4,
//       name: 'Rajhans Multiplex',
//       address: 'Pal Hazira Road, Adajan, Surat',
//       timings: ['10:15 AM', '01:45 PM', '05:30 PM', '09:45 PM'],
//       mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rajhans+Cinema+Pal+Adajan+Surat'
//     }
//   ];


//   loadMovie(id: number) {
//     this.movieService.getMovieById(id).subscribe(data => {
//       this.movie = data;
//     });

//     this.movieService.getMovies().subscribe(data => {
//       this.similarMovies = data.filter(m => m.id !== id);
//     });
//   }

//   selectDate(index: number) {
//     this.dates.forEach(d => d.active = false);
//     this.dates[index].active = true;
//     this.selectedTime = null;
//     this.selectedTheater = null;
//   }

//   selectTime(time: string, theaterId: number) {
//     this.selectedTime = time;
//     this.selectedTheater = theaterId;
//     console.log(`Booking ${this.movie?.title} at Theater ${theaterId} for ${time}`);
//   }


//   proceedToBooking() {
//     if (this.movie && this.selectedTheater && this.selectedTime) {

//       // YAHAN FIX HAI: ID se theater ka NAME nikalna padega navigation ke liye
//       const selectedTheaterObj = this.theaters.find(t => t.id === this.selectedTheater);
//       const theaterName = selectedTheaterObj ? selectedTheaterObj.name : '';

//       // Navigate with QueryParams so the Booking page can catch 'theater' and 'time'
//       this.router.navigate(['/booking', this.movie.id], {
//         queryParams: {
//           name: this.movie.title,
//           theater: theaterName,
//           time: this.selectedTime
//         }
//       });

//     } else {
//       alert('Please select a theater and a showtime first.');
//       this.scrollToBooking();
//     }
//   }
  
//   scrollToBooking() {
//     const element = document.getElementById('booking-section');
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   }
// }
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
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
  private router = inject(Router);
  private movieService = inject(MovieService);
  dates: any[] = [];
  similarMovies: Movie[] = [];

  cast = [
    { name: 'Cillian Murphy', role: 'Oppenheimer', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Cillian_Murphy_Press_Conference_The_Party_Berlinale_2017_02cr.jpg' },
    { name: 'Robert Downey Jr.', role: 'Lewis Strauss', image: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg' },
    { name: 'Emily Blunt', role: 'Kitty', image: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Emily_Blunt_by_Gage_Skidmore_2.jpg' },
    { name: 'Matt Damon', role: 'Leslie Groves', image: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Damon_Matt_2009_Venice_Film_Festival.jpg' },
    { name: 'Florence Pugh', role: 'Jean Tatlock', image: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Florence_Pugh_SDCC_2019.jpg' }
  ];

  ngOnInit() {
    this.generateLiveDates();
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) { this.loadMovie(id); }
    });
  }

  generateLiveDates() {
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const tempDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      let weekdayLabel = dayNames[d.getDay()];
      if (i === 0) weekdayLabel = 'TODAY';
      if (i === 1) weekdayLabel = 'TOMORROW';
      tempDates.push({
        day: d.getDate().toString().padStart(2, '0'),
        month: monthNames[d.getMonth()],
        weekday: weekdayLabel,
        active: i === 0,
        fullDate: d
      });
    }
    this.dates = tempDates;
  }

  isTimePassed(timeStr: string): boolean {
    const activeDate = this.dates.find(d => d.active);
    if (!activeDate || activeDate.weekday !== 'TODAY') return false;
    const now = new Date();
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    const showTime = new Date();
    showTime.setHours(hours, minutes, 0, 0);
    return showTime < now;
  }

  theaters = [
    { id: 1, name: 'PVR: Rahul Raj Mall', address: 'Piplod, Dumas Road, Surat', timings: ['10:00 AM', '01:30 PM', '05:00 PM', '09:00 PM'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=PVR+Rahul+Raj+Mall+Surat' },
    { id: 2, name: 'INOX: VR Mall', address: 'Dumas Road, Magdalla, Surat', timings: ['11:00 AM', '02:00 PM', '06:15 PM', '10:30 PM'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=INOX+VR+Mall+Surat' },
    { id: 3, name: 'Cinépolis: Imperial Square', address: 'Adajan Gam, Surat', timings: ['09:30 AM', '12:45 PM', '04:30 PM', '08:15 PM'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cinepolis+Imperial+Square+Mall+Surat' },
    { id: 4, name: 'Rajhans Multiplex', address: 'Pal Hazira Road, Adajan, Surat', timings: ['10:15 AM', '01:45 PM', '05:30 PM', '09:45 PM'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rajhans+Cinema+Pal+Adajan+Surat' }
  ];

  loadMovie(id: number) {
    this.movieService.getMovieById(id).subscribe(data => { this.movie = data; });
    this.movieService.getMovies().subscribe(data => { this.similarMovies = data.filter(m => m.id !== id); });
  }

  selectDate(index: number) {
    this.dates.forEach(d => d.active = false);
    this.dates[index].active = true;
    this.selectedTime = null;
    this.selectedTheater = null;
  }

  selectTime(time: string, theaterId: any) {
    this.selectedTime = time;
    this.selectedTheater = Number(theaterId);
    console.log("Selected:", time, "Theater ID:", this.selectedTheater);
  }

  // --- YE WALA FUNCTION TERE ROUTES KE HISAB SE SAHI KIYA HAI ---
  proceedToBooking() {
    if (this.movie && this.selectedTheater && this.selectedTime) {
      
      // Tere routes.ts mein rasta hai: booking/:movieId/:theaterId/:time
      // Isliye humein navigate aise karna padega:
      this.router.navigate([
        '/booking', 
        this.movie.id, 
        this.selectedTheater, 
        this.selectedTime
      ]);

      console.log("Navigating to booking page...");

    } else {
      alert('Please select a theater and a showtime first.');
      this.scrollToBooking();
    }
  }

  scrollToBooking() {
    const element = document.getElementById('booking-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}