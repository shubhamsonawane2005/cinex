import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class DashboardComponent implements OnInit, OnDestroy {
  private pollingSubscription?: Subscription;
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 5;
  // Dynamic Stats
  stats = {
    totalBookings: 0,
    activeMovies: 8,
    totalRevenue: 0,
    newUsers: 0,
  };


  // 2. The Recent Bookings Data
  bookings: any[] = [];

  constructor(
    private adminService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.refreshAllData();

    this.pollingSubscription = interval(10000).subscribe(() => {
      this.refreshAllData();
    });
  }

  refreshAllData() {
    this.loadUserCount();
    this.loadBookingCount();
    this.loadDashboardData(this.currentPage);
  }

  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  loadUserCount() {
    this.adminService.getUserCount().subscribe({
      next: (res: any) => {
        console.log("Data received from Backend:", typeof res);
        if (typeof res === 'number') {
          this.stats.newUsers = res;
        }
        else if (res && res.count !== undefined) {
          this.stats.newUsers = res.count;
        }
        this.cdr.detectChanges();
        console.log(this.stats.newUsers)
      },
      error: (err) => {
        console.error("User count fetch karne mein dikkat aayi:", err);
      }
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
      error: (err) => console.error("Booking count error:", err)
    });
  }

 loadDashboardData(page: number) {
    this.adminService.getPagedBookings(page, this.limit).subscribe({
      next: (res: any) => {
        console.log("Backend Response:", res);
        if (res && res.success) {
          // Stats hamesha total hi dikhenge
          this.stats.totalBookings = res.totalBookings || 0;
          this.stats.totalRevenue = res.totalRevenue || 0;
          this.totalPages = res.totalPages || 1;
          this.currentPage = res.currentPage || page;

          if (res.data && Array.isArray(res.data)) {
          this.bookings = res.data.map((b: any) => ({
            id: b.bookingId,
            user: b.userName || 'Customer', // Agar user name backend mein hai
            movie: b.movieTitle,
            amount: b.totalAmount,
            status: b.paymentStatus || 'Confirmed'
          }));
        }else{
          console.warn("Data array nahi mili, empty array set kar rahe hain");
          this.bookings = [];
        }

          this.cdr.detectChanges();
        }
      },
      error: (err) =>{ console.error("Stats fetch error:", err);
        this.bookings = [];
      }
    });
  }

  changePage(newPage: number) {
    // console.log('Button clicked! New page:', newPage);
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadDashboardData(this.currentPage);
    }
  }

  // 3. Helper to set color classes based on status
  getStatusClass(status: string) {
    switch (status) {
      case 'Confirmed': return 'success'; // Green
      case 'Pending': return 'pending';   // Yellow
      case 'Cancelled': return 'failed';  // Red
      default: return '';
    }
  }
}