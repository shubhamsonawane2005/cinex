import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService, Movie as ServiceMovie } from '../../services/movie'; // Service import karein
import { Observable, forkJoin } from 'rxjs';
import { AuthService } from '../../services/auth.service';

// Manage Movies ki local interface (Showtimes ke liye)
interface ShowtimeSlot {
  time: string;
  bookedCount: number;
}

interface TheaterShowtime {
  theaterId: number;
  theaterName: string;
  times: ShowtimeSlot[];
}

// Backend se aane wale Movie data ke saath local status aur showtimes jodna
export interface ManageMovie extends ServiceMovie {
  _id: string;
  status: 'released' | 'upcoming';
  showtimes: TheaterShowtime[];
}

@Component({
  selector: 'app-manage-movies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-movies.html',
  styleUrls: ['./manage-movies.css'],
})
export class ManageMoviesComponent implements OnInit {
  private movieService = inject(MovieService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  todayDate: string = new Date().toISOString().split('T')[0];

  allMovies: ManageMovie[] = [];
  activeTab: 'released' | 'upcoming' = 'released';
  viewMode: 'grid' | 'list' = 'grid';
  
  showInspector: boolean = false;
  inspectMovie: ManageMovie | null = null;
  inspectTheaterId: number | null = null;
  inspectTime: string = '';

  // Form Management
  showForm = false;
  isEditing = false;
  movieForm: any = {
    title: '',
    genre: '',
    image: '',
    status: 'released',
    showtimes: [],
  };

  constructor() {}

  ngOnInit() {
    this.loadMoviesFromService();
  }

  // --- DATA LOADING LOGIC ---
  loadMoviesFromService() {
    // Parallel API calls to fetch both statuses
    forkJoin({
      released: this.movieService.getMovies(),
      upcoming: this.movieService.getUpComingMovies(),
    }).subscribe({
      next: ({ released, upcoming }) => {
        // 1. Map Released Movies
        const releasedMapped: ManageMovie[] = released.map((m) => ({
          ...m,
          _id: m._id, // Ensure _id is used
          status: 'released',
          showtimes: this.getDefaultShowtimes(),
        }));

        // 2. Map Upcoming Movies
        const upcomingMapped: ManageMovie[] = upcoming.map((m) => ({
          ...m,
          _id: m._id,
          status: 'upcoming',
          showtimes: [], // Upcoming movies don't have showtimes yet
        }));

        // 3. Combine and remove potential duplicates based on _id
        const combinedMovies = [...releasedMapped, ...upcomingMapped];
        this.allMovies = combinedMovies.filter(
          (movie, index, self) => index === self.findIndex((m) => m._id === movie._id),
        );

        console.log('Total Movies Loaded:', this.allMovies);
        this.fetchAllBookingCounts();
        this.cdr.detectChanges(); // Ensure UI updates
      },
      error: (err) => console.error('Error loading movies', err),
    });
  }

  // --- BOOKING LOGIC ---
  fetchAllBookingCounts() {
    this.allMovies.forEach((movie) => {
      // Only fetch bookings for released movies
      if (movie.status === 'released') {
        movie.showtimes.forEach((theater) => {
          theater.times.forEach((timeSlot: ShowtimeSlot) => {
            this.authService
              .getBookedSeats(movie.title, theater.theaterName, this.todayDate, timeSlot.time)
              .subscribe((seats) => {
                timeSlot.bookedCount = seats.length;
                this.cdr.detectChanges(); // Update count in UI
              });
          });
        });
      }
    });
  }

  // --- CRUD FORM LOGIC ---

  openAddForm() {
    this.showForm = true;
    this.isEditing = false;
    this.movieForm = {
      title: '',
      genre: '',
      image: '',
      status: 'released',
      showtimes: [],
    };
  }

  closeForm() {
    this.showForm = false;
  }

  saveMovie() {
    const movieData = { ...this.movieForm };
    console.log('Saving movie:', movieData);

    const action$: Observable<any> = this.isEditing
      ? this.movieService.updateMovie(movieData)
      : movieData.status === 'upcoming'
        ? this.movieService.addUpcomingMovie(movieData) // Backend saves with status 'upcoming'
        : this.movieService.addMovie(movieData); // Backend saves with status 'released'

    action$.subscribe({
      next: () => {
        this.loadMoviesFromService(); // Reload data
        this.closeForm();
      },
      error: (err) => console.error('Operation failed', err),
    });
  }

  editMovie(movie: ManageMovie) {
    this.isEditing = true;
    this.showForm = true;
    this.movieForm = { ...movie };
    console.log('Editing Movie:', movie.title);
  }

  deleteMovie(id: string) {
    if (confirm('Are you sure you want to delete this movie?')) {
      this.movieService.deleteMovie(id).subscribe({
        next: () => {
          this.loadMoviesFromService(); // Reload data immediately
        },
        error: (err) => console.error('Delete Failed', err),
      });
    }
  }

  // --- TIME & UI HELPERS ---

  // Hardcoded showtimes as per previous logic
  private getDefaultShowtimes(): TheaterShowtime[] {
    return [
      {
        theaterId: 1,
        theaterName: 'PVR: Rahul Raj Mall',
        times: ['10:00 AM', '01:30 PM', '05:00 PM', '09:00 PM'].map((t) => ({
          time: t,
          bookedCount: 0,
        })),
      },
      {
        theaterId: 2,
        theaterName: 'INOX: VR Mall',
        times: ['11:00 AM', '02:00 PM', '06:15 PM', '10:30 PM'].map((t) => ({
          time: t,
          bookedCount: 0,
        })),
      },
    ];
  }

  get filteredMovies() {
    const filtered = this.allMovies.filter((m) => m.status === this.activeTab);
    console.log(`Filtered for ${this.activeTab}:`, filtered);
    return filtered;
  }

  isTimePassed(timeStr: string): boolean {
    if (!timeStr) return false;
    const now = new Date();
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    const showTime = new Date();
    showTime.setHours(hours, minutes, 0, 0);
    return showTime < now;
  }

  isMovieOver(movie: ManageMovie): boolean {
    if (movie.status === 'upcoming' || !movie.showtimes.length) return false;
    let totalShows = 0;
    let passedShows = 0;
    movie.showtimes.forEach((s) => {
      s.times.forEach((t) => {
        totalShows++;
        if (this.isTimePassed(t.time)) passedShows++;
      });
    });
    return totalShows > 0 && totalShows === passedShows;
  }

  openInspector(movie: ManageMovie) {
    this.showInspector = true;
    this.inspectMovie = movie;
    if (movie.showtimes && movie.showtimes.length > 0) {
      this.inspectTheaterId = movie.showtimes[0].theaterId;
      if (movie.showtimes[0].times && movie.showtimes[0].times.length > 0) {
        this.inspectTime = movie.showtimes[0].times[0].time;
        this.loadBookings();
      }
    }
  }

  loadBookings() {
    console.log('Loading seats for:', this.inspectTime);
  }
}
