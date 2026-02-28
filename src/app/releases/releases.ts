import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService, Movie } from '../services/movie';
import { AuthService } from '../services/auth.service'; // 1. AuthService import kiya

@Component({
  selector: 'app-releases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './releases.html',
  styleUrl: './releases.css',
})
export class ReleasesComponent implements OnInit {
  upcomingMovies: Movie[] = [];
  private movieService = inject(MovieService);
  private authService = inject(AuthService); // 2. AuthService inject kiya

  ngOnInit() {
    this.movieService.getUpComingMovies().subscribe({
      next: (data) => {
        this.upcomingMovies = data;
      },
      error: (err) => console.error('Could not load upcoming movies', err),
    });
  }

  notifyUser(movieTitle: string) {
    const currentUser = this.authService.getCurrentUser();

    let email = currentUser ? currentUser.email : prompt(`Enter email for ${movieTitle}:`);

    if (email && email.includes('@')) {
      const data = { email: email, movieName: movieTitle };

      this.authService.setupNotification({ email, movieName: movieTitle }).subscribe({
        next: (res) => {
          alert(`Success! Notification set for ${movieTitle}. Check your email!`);
        },
        error: (err) => {
          alert('Error setting notification. Please try again.');
        },
      });
    } else if (email) {
      alert('Please enter a valid email address!');
    }
  }
}
