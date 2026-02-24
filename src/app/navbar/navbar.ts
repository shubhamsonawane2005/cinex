import { Component, inject  } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule], 
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  // constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  searchTerm: string = ''; 
  private router = inject(Router);

 
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

  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/movies'], { queryParams: { q: this.searchTerm } });
    }
  }

  // Logout function
  logout() {
    localStorage.removeItem('token'); 
    alert("Logged out successfully!");
    this.router.navigate(['/login']); 
  }
}