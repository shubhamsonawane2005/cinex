
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService, Movie } from '../services/movie';
import { AuthService } from '../services/auth.service'; // 1. AuthService import kiya

@Component({
  selector: 'app-releases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './releases.html',
  styleUrl: './releases.css'
})
export class ReleasesComponent implements OnInit {

  upcomingMovies: Movie[] = [];
  private movieService = inject(MovieService);
  private authService = inject(AuthService); // 2. AuthService inject kiya

  ngOnInit() {
    this.movieService.getUpcomingMovies().subscribe(data => {
      this.upcomingMovies = data;
    });
  }

  // 3. Notify Me wala function jo Subham ne bola tha
  notifyUser(movieTitle: string) {
    const userEmail = prompt(`Enter your email to get notified for ${movieTitle}:`);
    
    if (userEmail && userEmail.includes('@')) {
      const data = { email: userEmail, movieName: movieTitle };
      
      this.authService.setupNotification(data).subscribe({
        next: (res) => {
          alert(`Success! Notification set for ${movieTitle}. Check your email!`);
        },
        error: (err) => {
          alert("Error setting notification. Please try again.");
        }
      });
    } else if (userEmail) {
      alert("Please enter a valid email address!");
    }
  }
}