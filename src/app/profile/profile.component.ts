import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  myBookings: any[] = [];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProfileData();
    }
  }

  loadProfileData() {
    if (isPlatformBrowser(this.platformId)) {
      const email = localStorage.getItem('userEmail');

      if (email) {
        this.authService.getUserBookings(email).subscribe({
          next: (res: any) => {
            console.log('Bookings Loaded:', res);

            let allBookings: any[] = [];
            if (res && Array.isArray(res)) {
              allBookings = res;
            } else if (res && res.data && Array.isArray(res.data)) {
              allBookings = res.data;
            }

            this.myBookings = allBookings;
            this.cdr.detectChanges();
          },
          error: (err: any) => {
            console.error('Booking fetch error:', err);
            this.myBookings = [];
            this.cdr.detectChanges();
          },
        });
      }
    }
  }

  isExpired(showDate: any, showTime: string, createdAt?: any): boolean {
    if (!showTime) return false;

    try {
      const now = new Date();
      // Agar showDate hai toh wahi lein, warna createdAt (par dhyan rahe showDate hi honi chahiye future ticket ke liye)
      const dateValue = showDate || createdAt;
      if (!dateValue) return false;

      const ticketDate = new Date(dateValue);

      // Sirf date compare karne ke liye time zero set kar dete hain
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const showDay = new Date(
        ticketDate.getFullYear(),
        ticketDate.getMonth(),
        ticketDate.getDate(),
      );

      // 1. Agar show ki date aaj se pehle ki hai -> Expired
      if (showDay < today) return true;

      // 2. Agar show ki date aaj se baad ki hai -> Not Expired
      if (showDay > today) return false;

      // 3. Agar show aaj hi hai, tab Time check karein
      if (showDay.getTime() === today.getTime()) {
        const timeClean = showTime.trim().toUpperCase();
        const parts = timeClean.split(/\s+/);
        const hhmm = parts[0].split(':');

        let hours = parseInt(hhmm[0]);
        const minutes = parseInt(hhmm[1]);
        const modifier = timeClean.includes('PM') ? 'PM' : 'AM';

        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();

        if (currentHours > hours) return true;
        if (currentHours === hours && currentMinutes >= minutes) return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  }

  cancelTicket(id: string) {
    if (!id) return;
    if (confirm('Do you want to cancel the ticket?')) {
      this.authService.cancelBooking(id).subscribe({
        next: () => {
          alert('Ticket Cancelled!');
          this.loadProfileData();
        },
        error: (err: any) => alert('Cancellation failed!'),
      });
    }
  }
}
