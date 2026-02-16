// import { Component, inject } from '@angular/core';
// import { RouterModule, Router } from '@angular/router';
// import { FormsModule } from '@angular/forms'; // <--- Import this for [(ngModel)]

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [RouterModule, FormsModule], // <--- Add FormsModule here
//   templateUrl: './navbar.html',
//   styleUrl: './navbar.css'
// })
// export class NavbarComponent {
  
//   searchTerm: string = ''; // Stores what the user types
//   private router = inject(Router);

//   onSearch() {
//     if (this.searchTerm.trim()) {
//       // Navigate to Movies Page with a "query parameter"
//       this.router.navigate(['/movies'], { queryParams: { q: this.searchTerm } });
//     }
//   }
// }
import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // <--- ngIf ke liye ye zaroori hai

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule], // <--- CommonModule add kiya
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  
  searchTerm: string = ''; 
  private router = inject(Router);

  // Check karne ke liye ki user login hai ya nahi
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/movies'], { queryParams: { q: this.searchTerm } });
    }
  }

  // Logout function
  logout() {
    localStorage.removeItem('token'); // Token khatam
    alert("Logged out successfully!");
    this.router.navigate(['/login']); // Login pe wapas
  }
}