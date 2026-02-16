import { Component , inject ,PLATFORM_ID, Inject} from '@angular/core';
import { RouterModule ,Router} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule], 
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayoutComponent {
   private router = inject(Router);
   private platformId = inject(PLATFORM_ID);

logout() {
   if (isPlatformBrowser(this.platformId)) {
      // 1. Sabhi details saaf karein
      localStorage.removeItem('token');
      localStorage.removeItem('role'); 
      
      alert("Logged out successfully!");
      
      // 2. Login page par bhej dein
      this.router.navigate(['/login']);
    }
  }
}