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

            this.myBookings = allBookings;
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

 
  isExpired(showDate: any, showTime: string, createdAt?: any): boolean {
    if (!showTime) return false;
    try {
      const now = new Date();
      
      
      const todayNum = parseInt(
        now.getFullYear().toString() + 
        String(now.getMonth() + 1).padStart(2, '0') + 
        String(now.getDate()).padStart(2, '0')
      );

      
      const dateToUse = showDate || createdAt;
      if (!dateToUse) return false;

      const tDate = new Date(dateToUse);
      const ticketNum = parseInt(
        tDate.getFullYear().toString() + 
        String(tDate.getMonth() + 1).padStart(2, '0') + 
        String(tDate.getDate()).padStart(2, '0')
      );

     
      if (ticketNum < todayNum) {
        return true; 
      }

     
      if (ticketNum === todayNum) {
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
    if (confirm("Do you want to cancel the ticket?")) {
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