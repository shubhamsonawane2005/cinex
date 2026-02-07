import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class DashboardComponent {
  // Dynamic Stats
  stats = {
    totalBookings: 1245,
    activeMovies: 8,
    totalRevenue: 450000,
    newUsers: 120
  };

  // 2. The Recent Bookings Data
  bookings = [
    { id: '#BK-2024', user: 'Rahul Sharma', movie: 'Border 2', amount: 450, status: 'Confirmed' },
    { id: '#BK-2023', user: 'Anjali Patel', movie: 'Dhurandhar', amount: 320, status: 'Pending' },
    { id: '#BK-2022', user: 'Vikas Dubey', movie: 'Singham Again', amount: 900, status: 'Cancelled' },
    { id: '#BK-2021', user: 'Priya Singh', movie: 'Scream 7', amount: 500, status: 'Confirmed' }
  ];

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