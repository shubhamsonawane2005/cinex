import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <--- Import this for [(ngModel)]

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, FormsModule], // <--- Add FormsModule here
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  
  searchTerm: string = ''; // Stores what the user types
  private router = inject(Router);

  onSearch() {
    if (this.searchTerm.trim()) {
      // Navigate to Movies Page with a "query parameter"
      this.router.navigate(['/movies'], { queryParams: { q: this.searchTerm } });
    }
  }
}