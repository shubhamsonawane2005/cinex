import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- INTERFACES ---
interface BookingData {
  time: string;
  seats: string[];
}

interface Showtime {
  theaterId: number;
  theaterName: string;
  times: string[];
  bookings?: BookingData[];
}

export interface Movie {
  id: number;
  title: string;
  image: string;
  backdrop: string;
  genre: string;
  rating: number;
  releaseDate: string;
  description: string;
  status: 'released' | 'upcoming';
  showtimes: Showtime[]; 
}

@Component({
  selector: 'app-manage-movies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-movies.html',
  styleUrls: ['./manage-movies.css']
})
export class ManageMoviesComponent {
  
  activeTab: 'released' | 'upcoming' = 'released';
  viewMode: 'grid' | 'list' = 'grid';
  
  showForm = false;
  isEditing = false;
  activeFormTab: 'basic' | 'media' | 'shows' = 'basic';

  // --- INSPECTOR STATE ---
  showInspector = false;
  inspectMovie: Movie | null = null;
  inspectTheaterId: number | null = null;
  inspectTime: string = '';
  bookedSeatsPreview: string[] = []; 

  // --- SEAT LAYOUT (Matches Booking Page) ---
  rows: string[] = ['A', 'B', 'C', 'D', 'E', 'F']; 
  leftSeats: number[] = [1, 2, 3, 4];   // Left side of aisle
  rightSeats: number[] = [5, 6, 7, 8];  // Right side of aisle
  
  availableTheaters = [
    { id: 1, name: 'PVR: Rahul Raj Mall' },
    { id: 2, name: 'INOX: VR Mall' },
    { id: 3, name: 'Cinépolis: Imperial Square' },
    { id: 4, name: 'Rajhans Multiplex' }
  ];

  tempTheaterId: number | null = null;
  tempTime: string = '';
  movieForm: Movie = this.getEmptyMovie();

  allMovies: Movie[] = [
    {
      id: 1,
      title: 'Border 2',
      genre: 'War',
      rating: 9.1,
      status: 'released',
      image: 'https://placehold.co/300x450/333/FFF?text=Border+2',
      backdrop: 'https://placehold.co/800x450/333/FFF?text=Border+2+Banner',
      releaseDate: '',
      description: 'The sequel to the classic war movie.',
      showtimes: [
        {
          theaterId: 1,
          theaterName: 'PVR: Rahul Raj Mall',
          times: ['10:00', '17:00'],
          // MOCK DATA: Simulating booked seats
          bookings: [
            { time: '10:00', seats: ['A1', 'A2', 'B3', 'B4', 'C5'] },
            { time: '17:00', seats: ['D1', 'D2'] }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Border 1',
      genre: 'War',
      rating: 9.1,
      status: 'released',
      image: 'https://placehold.co/300x450/333/FFF?text=Border+2',
      backdrop: 'https://placehold.co/800x450/333/FFF?text=Border+2+Banner',
      releaseDate: '',
      description: 'The sequel to the classic war movie.',
      showtimes: [
        {
          theaterId: 1, theaterName: 'PVR: Rahul Raj Mall', times: ['10:00 AM', '05:00 PM'],
          bookings: [
            { time: '10:00', seats: ['A1', 'A2', 'B3', 'B4', 'C5'] },
            { time: '17:00', seats: ['D1', 'D2'] }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Dhurandhar',
      genre: 'Spy',
      rating: 8.8,
      status: 'released',
      image: 'dhurandhar.jpg',
      backdrop: '',
      releaseDate: '',
      description: '',
      showtimes: [
        { theaterId: 3, theaterName: 'INOX: VR Mall', times: ['2:00 PM', '09:00 PM'] }
      ]
    },
    {
      id: 3,
      title: 'Avenger:Doomsday',
      genre: 'Sci-Fi/superhero',
      rating: 0,
      status: 'upcoming',
      image: 'avenger.jpg',
      backdrop: '',
      releaseDate: '2025-07-11',
      description: '',
      showtimes: [
        { theaterId: 2, theaterName: 'Cinépolis: Imperial Square', times: ['10:30 AM', '07:00 PM'] }
      ]
    }
  ];

  get filteredMovies() {
    return this.allMovies.filter(m => m.status === this.activeTab);
  }

  // --- INSPECTOR LOGIC ---
  openInspector(movie: Movie) {
    this.inspectMovie = movie;
    this.showInspector = true;
    if (movie.showtimes && movie.showtimes.length > 0) {
      this.inspectTheaterId = movie.showtimes[0].theaterId;
      if (movie.showtimes[0].times.length > 0) {
        this.inspectTime = movie.showtimes[0].times[0];
        this.loadBookings();
      }
    }
  }

  closeInspector() {
    this.showInspector = false;
    this.inspectMovie = null;
    this.bookedSeatsPreview = [];
  }

  loadBookings() {
    if (!this.inspectMovie || !this.inspectTheaterId || !this.inspectTime) return;
    const show = this.inspectMovie.showtimes.find(s => s.theaterId == this.inspectTheaterId);
    if (show && show.bookings) {
      const record = show.bookings.find(b => b.time === this.inspectTime);
      this.bookedSeatsPreview = record ? record.seats : [];
    } else {
      this.bookedSeatsPreview = [];
    }
  }

  isSeatBooked(row: string, num: number): boolean {
    return this.bookedSeatsPreview.includes(row + num);
  }

  get occupancyPercent() {
    const total = this.rows.length * (this.leftSeats.length + this.rightSeats.length);
    if (this.bookedSeatsPreview.length === 0) return 0;
    return Math.round((this.bookedSeatsPreview.length / total) * 100);
  }

  // --- CRUD LOGIC (Standard) ---
  addShowtime() {
    if (!this.tempTheaterId || !this.tempTime) return;
    const theater = this.availableTheaters.find(t => t.id === this.tempTheaterId);
    if (!theater) return;
    if (!this.movieForm.showtimes) this.movieForm.showtimes = [];

    let entry = this.movieForm.showtimes.find(s => s.theaterId === theater.id);
    if (entry) {
      if (!entry.times.includes(this.tempTime)) entry.times.push(this.tempTime);
    } else {
      this.movieForm.showtimes.push({ theaterId: theater.id, theaterName: theater.name, times: [this.tempTime], bookings: [] });
    }
    this.tempTime = ''; 
  }

  removeTime(theaterId: number, time: string) { 
    const entry = this.movieForm.showtimes.find(s => s.theaterId === theaterId);
    if (entry) {
      entry.times = entry.times.filter(t => t !== time);
      if (entry.times.length === 0) this.removeTheater(theaterId);
    }
  }
  removeTheater(theaterId: number) { this.movieForm.showtimes = this.movieForm.showtimes.filter(s => s.theaterId !== theaterId); }
  openAddForm() { this.showForm = true; this.isEditing = false; this.activeFormTab = 'basic'; this.movieForm = this.getEmptyMovie(); }
  editMovie(movie: Movie) { this.showForm = true; this.isEditing = true; this.activeFormTab = 'basic'; this.movieForm = JSON.parse(JSON.stringify(movie)); if(!this.movieForm.showtimes) this.movieForm.showtimes = []; }
  deleteMovie(id: number) { if(confirm('Delete?')) this.allMovies = this.allMovies.filter(m => m.id !== id); }
  saveMovie() { 
    if (this.isEditing) { this.allMovies = this.allMovies.map(m => m.id === this.movieForm.id ? { ...this.movieForm } : m); } 
    else { this.movieForm.id = Date.now(); this.allMovies.push({ ...this.movieForm }); }
    this.closeForm(); 
  }
  closeForm() { this.showForm = false; }
  getEmptyMovie(): Movie { return { id: 0, title: '', image: '', backdrop: '', genre: '', rating: 0, releaseDate: '', description: '', status: 'released', showtimes: [] }; }
}