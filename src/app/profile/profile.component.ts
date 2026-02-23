import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule, isPlatformBrowser } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
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
            console.log("Bookings Loaded:", res); 
            
            let allBookings: any[] = [];
            if (res && Array.isArray(res)) {
              allBookings = res;
            } else if (res && res.data && Array.isArray(res.data)) {
              allBookings = res.data;
            }

            // Error fix yahan hai: (ticket: any) add kar diya
            this.myBookings = allBookings.filter((ticket: any) => !this.isExpired(ticket.showDate, ticket.showTime));
            
            this.cdr.detectChanges(); 
          },
          error: (err: any) => {
            console.error("Booking fetch error:", err);
            this.myBookings = [];
            this.cdr.detectChanges();
          }
        });
      }
    }
  }

  isExpired(showDate: string, showTime: string): boolean {
    if (!showDate || !showTime) return false;
    try {
      const now = new Date();
      // Browser compatibility ke liye space replace aur date string handle
      const showDateTime = new Date(`${showDate} ${showTime}`);
      
      if (isNaN(showDateTime.getTime())) {
          return false; 
      }

      return now.getTime() > showDateTime.getTime();
    } catch (e) {
      return false;
    }
  }

  cancelTicket(id: string) {
    if (!id) return;
    if (confirm("Do you want to cancel the ticket")) {
      this.authService.cancelBooking(id).subscribe({
        next: () => {
          alert("Ticket Cancelled!");
          this.loadProfileData(); 
        },
        error: (err: any) => alert("Cancellation failed!")
      });
    }
  }
}