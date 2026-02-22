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
        // Sirf Bookings fetch kar rahe hain, User Details wala dabba hata diya
        this.authService.getUserBookings(email).subscribe({
          next: (res: any) => {
            console.log("Bookings Loaded:", res); 
            
            if (res && Array.isArray(res)) {
              this.myBookings = res;
            } else if (res && res.data && Array.isArray(res.data)) {
              this.myBookings = res.data;
            } else {
              this.myBookings = [];
            }
            
            this.cdr.detectChanges(); 
          },
          error: (err) => {
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
      // String date ko object mein convert karke check karna
      const showDateTime = new Date(`${showDate} ${showTime}`);
      return now.getTime() > showDateTime.getTime();
    } catch (e) {
      return false;
    }
  }

  cancelTicket(id: string) {
    if (confirm("Do you want to cancel the ticket")) {
      this.authService.cancelBooking(id).subscribe({
        next: () => {
          alert("Ticket Cancelled!");
          this.loadProfileData(); 
        },
        error: (err) => alert("Cancellation failed!")
      });
    }
  }
}