import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService, Movie as ServiceMovie } from '../../services/movie'; // Service import karein
import { Observable, forkJoin } from 'rxjs';
import { AuthService } from '../../services/auth.service';

// Manage Movies ki local interface (Showtimes ke liye)
interface Showtime {
  theaterId: number;
  theaterName: string;
  times: string[];
}

export interface ManageMovie extends ServiceMovie {
  _id: string;
  status: 'released' | 'upcoming';
  showtimes: any[];
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

  ngOnInit() {
    this.loadMoviesFromService();
  }

  loadMoviesFromService() {
    forkJoin({
      released: this.movieService.getMovies(),
      upcoming: this.movieService.getUpComingMovies(),
    }).subscribe(({ released, upcoming }) => {
      const releasedMapped: ManageMovie[] = released.map((m) => {
        const theaterShowtimes = [
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

        return {
          ...m,
          id: Number(m._id),
          status: 'released',
          showtimes: theaterShowtimes,
        };
      });

      const upcomingMapped: ManageMovie[] = upcoming.map((m) => ({
        ...m,
        id: m._id,
        status: 'upcoming',
        showtimes: [],
      }));

      this.allMovies = [...releasedMapped, ...upcomingMapped];

      this.fetchAllBookingCounts();
    });
  }
  fetchAllBookingCounts() {
    this.allMovies.forEach((movie) => {
      if (movie.status === 'released') {
        movie.showtimes.forEach((theater) => {
          theater.times.forEach((timeSlot: any) => {
            this.authService
              .getBookedSeats(movie.title, theater.theaterName, this.todayDate, timeSlot.time)
              .subscribe((seats) => {
                timeSlot.bookedCount = seats.length;
                this.cdr.detectChanges(); // UI refresh
              });
          });
        });
      }
    });
  }
  // --- CRUD FORM LOGIC ---

  // Show the form
  showForm = false;
  isEditing = false;
  movieForm: any = {
    title: '',
    genre: '',
    image: '',
    status: 'released',
    showtimes: [],
  };

  // 1. Ffor open the form
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

  // 2. for close the form
  closeForm() {
    this.showForm = false;
  }

  // 3. for save the form
  saveMovie() {
    const movieData = { ...this.movieForm };
    const action$: Observable<any> = this.isEditing
      ? this.movieService.updateMovie(movieData)
      : movieData.status === 'upcoming'
        ? this.movieService.addUpcomingMovie(movieData) // Assume this exists
        : this.movieService.addMovie(movieData); // Existing add method

    action$.subscribe({
      next: () => {
        this.loadMoviesFromService();
        this.closeForm();
      },
      error: (err) => console.error('Operation failed', err),
    });
  }

  // --- TIME CALCULATION LOGIC ---
  isTimePassed(timeStr: any): boolean {
    if (!timeStr || typeof timeStr !== 'string') return false; // Safety check

    const now = new Date();
    let hours: number, minutes: number;

    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      const [time, modifier] = timeStr.split(' ');
      [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
    } else {
      [hours, minutes] = timeStr.split(':').map(Number);
    }

    const showTime = new Date();
    showTime.setHours(hours, minutes, 0, 0);
    return showTime < now;
  }

  isMovieOver(movie: ManageMovie): boolean {
    if (movie.status === 'upcoming' || !movie.showtimes.length) return false;

    let totalShows = 0;
    let passedShows = 0;

    movie.showtimes.forEach((s: any) => {
      s.times.forEach((t: any) => {
        // Change to any
        totalShows++;
        if (this.isTimePassed(t.time)) passedShows++;
      });
    });

    return totalShows > 0 && totalShows === passedShows;
  }

  get filteredMovies() {
    return this.allMovies.filter((m) => m.status === this.activeTab);
  }

  deleteMovie(id: string) {
    if (confirm('DO you want to delete?')) {
      this.movieService.deleteMovie(id).subscribe({
        next: () => {
          this.loadMoviesFromService();
        },
        error: (err) => console.error('Delete Faild', err),
      });
    }
  }

  editMovie(movie: ManageMovie) {
    this.isEditing = true;
    this.showForm = true;
    this.movieForm = { ...movie };
    console.log('Editing Movie:', movie.title, 'ID:', this.movieForm._id);
  }

  openInspector(movie: ManageMovie) {
    this.showInspector = true;
    this.inspectMovie = movie;

    if (movie.showtimes && movie.showtimes.length > 0) {
      const firstShow = movie.showtimes[0] as Showtime;

      this.inspectTheaterId = firstShow.theaterId;

      if (firstShow.times && firstShow.times.length > 0) {
        this.inspectTime = firstShow.times[0];
        this.loadBookings();
      }
    }
  }
  loadBookings() {
    // Yahan bookings load karne ka logic aayega
    console.log('Loading seats for:', this.inspectTime);
  }
}
