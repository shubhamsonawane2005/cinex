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

export class DashboardComponent implements OnInit , OnDestroy{
  private pollingSubscription?: Subscription;
  // Dynamic Stats
  stats = {
    totalBookings: 1245,
    activeMovies: 8,
    totalRevenue: 450000,
    newUsers: 0,
  };
  

  // 2. The Recent Bookings Data
  bookings = [
    { id: '#BK-2024', user: 'Rahul Sharma', movie: 'Border 2', amount: 450, status: 'Confirmed' },
    { id: '#BK-2023', user: 'Anjali Patel', movie: 'Dhurandhar', amount: 320, status: 'Pending' },
    { id: '#BK-2022', user: 'Vikas Dubey', movie: 'Singham Again', amount: 900, status: 'Cancelled' },
    { id: '#BK-2021', user: 'Priya Singh', movie: 'Scream 7', amount: 500, status: 'Confirmed' }
  ];

  constructor(
    private adminService: AuthService,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUserCount();
    this.pollingSubscription = interval(10000).subscribe(() => {
      this.loadUserCount();
    });
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
        if(typeof res === 'number'){
          this.stats.newUsers = res;
        }
        else if(res && res.count !== undefined){
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