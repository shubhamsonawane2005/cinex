import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router'; // Import Router
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar';
import { FooterComponent } from './footer/footer'; // Import Footer if you have it
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, FooterComponent], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  
  isAdminRoute = false;

  constructor(private router: Router) {
    // Watch the URL. If it contains '/admin', hide the nav/footer.
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute = event.url.includes('/admin');
    });
  }
}