import { ChangeDetectorRef, Component, OnInit, OnDestroy, inject ,PLATFORM_ID} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { TheaterService } from '../../services/theater.service';
import { isPlatformBrowser } from '@angular/common';

interface ScheduledMovie {
  title: string;
  image: string;
  times: { time: string; bookedCount: number; totalSeats: number }[];
}

interface Theater {
  id: number;
  name: string;
  location: string;
  facilities: string;
  movies: ScheduledMovie[];
}

@Component({
  selector: 'app-manage-theaters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-theaters.html',
  styleUrls: ['./manage-theaters.css'],
})
export class ManageTheatersComponent implements OnInit, OnDestroy {
  private movieService = inject(MovieService);
  private authService = inject(AuthService);
  private theaterService = inject(TheaterService);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  private movieSub?: Subscription;
  private eventHandler = () => this.loadRealMoviesToTheaters();
  

  todayDate: string = new Date().toISOString().split('T')[0];
  showInspector = false;
  showForm = false;

  inspectTheaterName = '';
  inspectMovieTitle = '';
  inspectTime = '';

  rows: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];
  leftSeats = [1, 2, 3, 4];
  rightSeats = [5, 6, 7, 8];
  bookedSeats: string[] = [];

  theaterForm: Theater = {
    id: 0,
    name: '',
    location: '',
    facilities: '',
    movies: [],
  };

  theaters: Theater[] = [];

  // ---------------- INIT ----------------

  ngOnInit() {
    this.theaters= this.theaterService.getTheaters();
    this.loadRealMoviesToTheaters();
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('movieUpdated', this.eventHandler);
    }
  }

  ngOnDestroy() {
    this.movieSub?.unsubscribe();
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('movieUpdated', this.eventHandler);
    }
  }

  // ---------------- LOAD MOVIES ----------------

  loadRealMoviesToTheaters() {
    this.movieSub?.unsubscribe();

    this.movieSub = this.movieService.getMovies().subscribe({
      next: (realMovies: any[]) => {
        if (!realMovies || realMovies.length === 0) {
          console.log('No movies received from API');
          return;
        }

        this.theaters.forEach((theater) => {
          const times = this.getShowTimes(theater.name);

          theater.movies = realMovies.map((m: any) => ({
            title: m.title,
            image: m.image,
            times: times.map((t) => ({
              time: t,
              bookedCount: 0,
              totalSeats: 48,
            })),
          }));

          this.loadBookedCounts(theater);
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Movie load error:', err);
      },
    });
  }

  private loadBookedCounts(theater: Theater) {
    theater.movies.forEach((movie) => {
      movie.times.forEach((timeSlot) => {
        this.authService
          .getBookedSeats(movie.title, theater.name, this.todayDate, timeSlot.time)
          .subscribe((seats: string[]) => {
            timeSlot.bookedCount = seats?.length || 0;
          });
      });
    });
  }

  private getShowTimes(name: string): string[] {
    if (name.includes('PVR')) return ['10:00 AM', '01:30 PM', '05:00 PM', '09:00 PM'];

    if (name.includes('INOX')) return ['11:00 AM', '02:00 PM', '06:15 PM', '10:30 PM'];

    if (name.includes('Cinépolis')) return ['09:30 AM', '12:45 PM', '04:30 PM', '08:15 PM'];

    return ['10:15 AM', '01:45 PM', '05:30 PM', '09:45 PM'];
  }

  // ---------------- TIME LOGIC ----------------

  isTimePassed(timeStr: string): boolean {
    const now = new Date();
    const showTime = this.convertToDate(timeStr);
    return showTime < now;
  }

  isMovieFinished(movie: ScheduledMovie): boolean {
    return movie.times?.every((slot) => this.isTimePassed(slot.time)) || false;
  }

  isTheaterClosed(theater: Theater): boolean {
    return theater.movies?.every((movie) => this.isMovieFinished(movie)) || false;
  }

  getOccupancyColor(timeStr: string): string {
    const now = new Date();
    const showStart = this.convertToDate(timeStr);
    const showEnd = new Date(showStart.getTime() + 3 * 60 * 60 * 1000);

    if (now > showEnd) return '#dc3545';
    if (now >= showStart && now <= showEnd) return '#28a745';
    return '#ffc107';
  }

  private convertToDate(timeStr: string): Date {
    const [time, modifier] = timeStr.split(' ');
    let [h, m] = time.split(':').map(Number);

    if (modifier === 'PM' && h < 12) h += 12;
    if (modifier === 'AM' && h === 12) h = 0;

    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  }

  // ---------------- ACTIONS ----------------

  openInspector(theaterName: string, movieTitle: string, timeData: any) {
    this.inspectTheaterName = theaterName;
    this.inspectMovieTitle = movieTitle;
    this.inspectTime = timeData.time;
    this.showInspector = true;

    this.authService
      .getBookedSeats(movieTitle, theaterName, this.todayDate, timeData.time)
      .subscribe((seats: string[]) => {
        this.bookedSeats = seats || [];
        this.cdr.detectChanges();
      });
  }

  closeInspector() {
    this.showInspector = false;
    this.bookedSeats = [];
  }

  isBooked(row: string, s: number): boolean {
    return this.bookedSeats.includes(row + s);
  }

  openAddForm() {
    this.showForm = true;
    this.theaterForm = {
      id: 0,
      name: '',
      location: '',
      facilities: '',
      movies: [],
    };
  }

  closeForm() {
    this.showForm = false;
  }

  saveTheater() {
    if (!this.theaterForm.name || !this.theaterForm.location) return;

    const newTheater = { 
    ...this.theaterForm, 
    id: Date.now(),
    movies: [] // Initialize empty movies array
  };

  // this.theaterService.addTheater(newTheater);
  this.theaters = this.theaterService.getTheaters();
  this.loadRealMoviesToTheaters();
  this.closeForm();
  }

  // deleteTheater(id: number) {
  //   if (confirm('Are you sure?')) {
  //     this.theaterService.deleteTheater(id);
  //     this.theaters = this.theaterService.getTheaters();
  //   }
  // }
}
