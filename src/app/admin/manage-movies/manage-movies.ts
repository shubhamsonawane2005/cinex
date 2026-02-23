import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService, Movie as ServiceMovie } from '../../services/movie'; // Service import karein
import { Observable, forkJoin } from 'rxjs';

// Manage Movies ki local interface (Showtimes ke liye)
interface Showtime {
  theaterId: number;
  theaterName: string;
  times: string[];
}

export interface ManageMovie extends ServiceMovie {
  id: number;
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
      upcoming: this.movieService.getUpcomingMovies(),
    }).subscribe(({ released, upcoming }) => {
      const releasedMapped: ManageMovie[] = released.map((m) => ({
        ...m,
        id: Number(m.id),
        status: 'released',
        showtimes: [
          {
            theaterId: 1,
            theaterName: 'PVR: Rahul Raj Mall',
            times: ['10:00 AM', '02:00 PM', '09:00 PM'],
          },
        ],
      }));

      const upcomingMapped: ManageMovie[] = upcoming.map((m) => ({
        ...m,
        id: Number(m.id),
        status: 'upcoming',
        showtimes: [],
      }));

      this.allMovies = [...releasedMapped, ...upcomingMapped];
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
    if (this.isEditing) {
      this.allMovies = this.allMovies.map((m) =>
        m.id === this.movieForm.id ? { ...this.movieForm } : m,
      );
    } else {
      this.movieForm.id = Date.now(); // Temporary unique ID
      this.allMovies.push({ ...this.movieForm });
    }
    this.closeForm();
  }

  // --- TIME CALCULATION LOGIC ---
  isTimePassed(timeStr: string): boolean {
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
      s.times.forEach((t: string) => {
        totalShows++;
        if (this.isTimePassed(t)) passedShows++;
      });
    });

    return totalShows > 0 && totalShows === passedShows;
  }

  get filteredMovies() {
    return this.allMovies.filter((m) => m.status === this.activeTab);
  }

  deleteMovie(id: number) {
    if (confirm('Kya aap is movie ko delete karna chahte hain?')) {
      this.allMovies = this.allMovies.filter((m) => m.id !== id);
    }
  }

  editMovie(movie: ManageMovie) {
    this.isEditing = true;
    this.showForm = true;
    this.movieForm = { ...movie };
    console.log('Editing Movie:', movie.title);
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
