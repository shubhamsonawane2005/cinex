import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { interval, Subscription } from 'rxjs';
import { MovieService } from '../../services/movie';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Services
  private movieService = inject(MovieService);
  private adminService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  // Subscriptions & Pagination
  private pollingSubscription?: Subscription;
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 5;

  // Dashboard Stats
  stats = {
    totalBookings: 0,
    activeMovies: 0,
    totalRevenue: 0,
    newUsers: 0,
  };

  // Recent Bookings Data
  bookings: any[] = [];

  ngOnInit() {
    this.refreshAllData();

    // Har 10 second mein data refresh hoga
    this.pollingSubscription = interval(10000).subscribe(() => {
      this.refreshAllData();
    });
  }

  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  refreshAllData() {
    this.loadUserCount();
    this.loadBookingCount();
    this.loadDashboardData(this.currentPage);
    this.calculateActiveMovies();
  }

  // --- Helper Logic for Active Movies ---

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

  calculateActiveMovies() {
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        const liveMovies = movies.filter((movie) => {
          const showtimes = [{ times: ['10:00 AM', '02:00 PM', '09:00 PM'] }];

          let totalShows = 0;
          let passedShows = 0;

          showtimes.forEach((s) => {
            s.times.forEach((t) => {
              totalShows++;
              if (this.isTimePassed(t)) passedShows++;
            });
          });

          
          return totalShows > passedShows;
        });
        // --- DEBUGGING CONSOLE LOGS ---
      console.log('--- Active Movies Check ---');
      console.log('Total Movies from Service:', movies.length);
      console.log('Active (Live) Movies Count:', liveMovies.length);
      console.log('List of Active Movies:', liveMovies.map(m => m.title));
      console.log('---------------------------');

        this.stats.activeMovies = liveMovies.length;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Active movies fetch error:', err),
    });
  }

  // --- Stats Loading Methods ---

  loadUserCount() {
    this.adminService.getUserCount().subscribe({
      next: (res: any) => {
        if (typeof res === 'number') {
          this.stats.newUsers = res;
        } else if (res && res.count !== undefined) {
          this.stats.newUsers = res.count;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('User count error:', err),
    });
  }

  loadBookingCount() {
    this.adminService.getBookingCount().subscribe({
      next: (res: any) => {
        if (res && res.count !== undefined) {
          this.stats.totalBookings = res.count;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Booking count error:', err),
    });
  }

  loadDashboardData(page: number) {
    this.adminService.getPagedBookings(page, this.limit).subscribe({
      next: (res: any) => {
        if (res && res.success) {
          this.stats.totalBookings = res.totalBookings || 0;
          this.stats.totalRevenue = res.totalRevenue || 0;
          this.totalPages = res.totalPages || 1;
          this.currentPage = res.currentPage || page;

          if (res.data && Array.isArray(res.data)) {
            this.bookings = res.data.map((b: any) => ({
              id: b.bookingId,
              user: b.userName || 'Customer',
              movie: b.movieTitle,
              amount: b.totalAmount,
              status: b.paymentStatus || 'Paid',
            }));
          } else {
            this.bookings = [];
          }
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Dashboard data fetch error:', err);
        this.bookings = [];
      },
    });
  }

  // --- UI Helpers ---

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadDashboardData(this.currentPage);
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Paid':
      case 'Confirmed':
        return 'success';
      case 'Pending':
        return 'pending';
      case 'Cancelled':
        return 'failed';
      default:
        return 'pending';
    }
  }
}
