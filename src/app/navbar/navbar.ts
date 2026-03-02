import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogAlertService } from '../services/dialog-alert.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  searchTerm: string = '';
  private router = inject(Router);
  private dialogAlertService = inject(DialogAlertService);

  get isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  get userName(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userName');
    }
    return null;
  }

  // ✅ FORCED NAVIGATION LOGIC
  navigateTo(path: string) {
    if (this.router.url.includes(path)) {
      // Agar usi page par hain, toh force reload karein
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([path]);
      });
    } else {
      // Normal navigate
      this.router.navigate([path]);
    }
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      // ✅ Search ke liye bhi same logic use karein
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/movies'], { queryParams: { q: this.searchTerm } });
      });
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName'); // Username bhi remove karein
    // alert('Logged out successfully!');
    this.dialogAlertService.showAlert('Logged out successfully');
    this.router.navigate(['/login']);
  }
}
