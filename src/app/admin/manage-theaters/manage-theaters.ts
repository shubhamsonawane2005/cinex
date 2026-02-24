import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie';
import { AuthService } from '../../services/auth.service';

// --- INTERFACES ---
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
export class ManageTheatersComponent implements OnInit {
  private movieService = inject(MovieService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  todayDate: string = new Date().toISOString().split('T')[0];

  // --- UI STATE ---
  showInspector = false;
  showForm = false;

  // --- INSPECTOR VARIABLES ---
  inspectTheaterName: string = '';
  inspectMovieTitle: string = '';
  inspectTime: string = '';

  rows: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];
  leftSeats = [1, 2, 3, 4];
  rightSeats = [5, 6, 7, 8];
  bookedSeats: string[] = [];

  theaterForm: Theater = { id: 0, name: '', location: '', facilities: '', movies: [] };

  // --- THEATER DATA ---
  theaters: Theater[] = [
    {
      id: 1,
      name: 'PVR: Rahul Raj Mall',
      location: 'Piplod, Surat',
      facilities: 'Dolby Atmos, Recliners',
      movies: [],
    },
    {
      id: 2,
      name: 'INOX: VR Mall',
      location: 'Dumas Rd, Surat',
      facilities: 'IMAX, Laser',
      movies: [],
    },
    {
      id: 3,
      name: 'Cinépolis: Imperial Square',
      location: 'Adajan, Surat',
      facilities: '4DX, Coffee Shop',
      movies: [],
    },
    {
      id: 4,
      name: 'Rajhans Multiplex',
      location: 'Pal, Surat',
      facilities: 'Budget Friendly',
      movies: [],
    },
  ];

  ngOnInit() {
    this.loadRealMoviesToTheaters();
  }

  loadRealMoviesToTheaters() {
    this.movieService.getMovies().subscribe((realMovies) => {
      const now = new Date();

      this.theaters.forEach((theater) => {
        // Har theater ke apne specific times define karein (User panel ki tarah)
        let theaterSpecificTimes: string[] = [];

        if (theater.name.includes('PVR')) {
          theaterSpecificTimes = ['10:00 AM', '01:30 PM', '05:00 PM', '09:00 PM'];
        } else if (theater.name.includes('INOX')) {
          theaterSpecificTimes = ['11:00 AM', '02:00 PM', '06:15 PM', '10:30 PM'];
        } else if (theater.name.includes('Cinépolis')) {
          theaterSpecificTimes = ['09:30 AM', '12:45 PM', '04:30 PM', '08:15 PM'];
        } else {
          theaterSpecificTimes = ['10:15 AM', '01:45 PM', '05:30 PM', '09:45 PM'];
        }

        theater.movies = realMovies.map((m) => {
          // Sirf wahi shows dikhayein jo abhi baki hain
          const futureTimes = theaterSpecificTimes.filter((timeStr) => {
            const [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;

            const showDateTime = new Date();
            showDateTime.setHours(hours, minutes, 0, 0);
            return showDateTime > now;
          });

          return {
            title: m.title,
            image: m.image,
            times: futureTimes.map((t) => ({
              time: t,
              bookedCount: 0,
              totalSeats: 48,
            })),
          };
        });

        // Database se real counts fetch karein
        theater.movies.forEach((movie) => {
          movie.times.forEach((timeSlot) => {
            this.authService
              .getBookedSeats(movie.title, theater.name, this.todayDate, timeSlot.time)
              .subscribe((seats) => {
                timeSlot.bookedCount = seats.length;
              });
          });
        });
      });
    });
  }

  // --- ACTIONS ---
  openAddForm() {
    this.showForm = true;
    this.theaterForm = { id: 0, name: '', location: '', facilities: '', movies: [] };
  }

  closeForm() {
    this.showForm = false;
  }

  saveTheater() {
    if (this.theaterForm.name && this.theaterForm.location) {
      this.theaterForm.id = Date.now();
      // Naye theater ko bhi default movies assign kar dete hain
      this.movieService.getMovies().subscribe((res) => {
        this.theaterForm.movies = res.slice(0, 1).map((m) => ({
          title: m.title,
          image: m.image,
          times: [{ time: '12:00 PM', bookedCount: 0, totalSeats: 48 }],
        }));
        this.theaters.push({ ...this.theaterForm });
      });
      this.closeForm();
    }
  }

  deleteTheater(id: number) {
    if (confirm('Are you sure?')) {
      this.theaters = this.theaters.filter((t) => t.id !== id);
    }
  }

  openInspector(theaterName: string, movieTitle: string, timeData: any) {
    this.authService.getBookedSeats(
      this.inspectMovieTitle.trim(),
      this.inspectTheaterName.trim(),
      this.todayDate,
      this.inspectTime.trim(),
    );
    this.bookedSeats = [];
    this.inspectTheaterName = theaterName;
    this.inspectMovieTitle = movieTitle;
    this.inspectTime = timeData.time;
    this.showInspector = true;
    // this.generateMockSeatMap(timeData.bookedCount);

    this.authService.getBookedSeats(movieTitle, theaterName, this.todayDate, timeData.time)
    .subscribe({
        next: (seats: string[]) => {
          this.bookedSeats = [...seats];
          console.log('Admin Inspector - Real Seats Loaded:', this.bookedSeats);
          this.cdr.detectChanges();

          setTimeout(() => {
          this.cdr.markForCheck();
        }, 100);
        },
        error: (err) => {
          console.error('Admin Inspector - Error:', err);
          this.bookedSeats = [];
        },
      });
  }

  closeInspector() {
    this.showInspector = false;
    this.bookedSeats = [];
  }

  generateMockSeatMap(count: number) {
    this.bookedSeats = [];
    const allSeats: string[] = [];
    this.rows.forEach((r) => {
      [...this.leftSeats, ...this.rightSeats].forEach((n) => allSeats.push(r + n));
    });
    for (let i = allSeats.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allSeats[i], allSeats[j]] = [allSeats[j], allSeats[i]];
    }
    this.bookedSeats = allSeats.slice(0, count);
  }

  isBooked(row: string, s: number): boolean {
    if (!this.bookedSeats || this.bookedSeats.length === 0) return false;
    const seatId = row.trim() + s.toString().trim();
    return this.bookedSeats.includes(seatId);
  }

  isTimePassed(timeStr: string): boolean {
    const now = new Date();
    let hours: number, minutes: number;

    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      const [time, modifier] = timeStr.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (modifier === 'PM' && h < 12) h += 12;
      if (modifier === 'AM' && h === 12) h = 0;
      hours = h;
      minutes = m;
    } else {
      [hours, minutes] = timeStr.split(':').map(Number);
    }

    const showTime = new Date();
    showTime.setHours(hours, minutes, 0, 0);
    return showTime < now;
  }

  getOccupancyColor(timeStr: string): string {
    const now = new Date();
    const isPast = this.isTimePassed(timeStr);

    const [timePart, modifier] = timeStr.split(' ');
    let [h, m] = timePart.split(':').map(Number);
    if (modifier === 'PM' && h < 12) h += 12;
    if (modifier === 'AM' && h === 12) h = 0;

    const showTime = new Date();
    showTime.setHours(h, m, 0, 0);

    const showEndTime = new Date(showTime.getTime() + 3 * 60 * 60 * 1000);

    if (now > showEndTime) {
      return '#dc3545';
    } else if (now >= showTime && now <= showEndTime) {
      return '#28a745';
    } else {
      return '#ffc107';
    }
  }
}
