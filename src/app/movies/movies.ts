import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MovieService, Movie } from '../services/movie';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movies.html',
  styleUrl: './movies.css'
})
export class MoviesComponent implements OnInit {
  
  movies: Movie[] = [];
  allMovies: Movie[] = []; // Backup for filtering
  
  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    // 1. Pehle saari movies load karo
    this.movieService.getMovies().subscribe((data) => {
      this.allMovies = data;
      this.movies = data; 

      // 2. Movies load hone ke BAAD check karo URL mein search term 'q' hai ya nahi
      this.route.queryParams.subscribe(params => {
        const searchTerm = params['q'];
        if (searchTerm) {
          this.filterMovies(searchTerm);
        } else {
          this.movies = [...this.allMovies]; // Reset to all movies if search is cleared
        }
      });
    });
  }

  filterMovies(term: string) {
    if (!term.trim()) {
      this.movies = [...this.allMovies];
      return;
    }
    
    const lowerTerm = term.toLowerCase().trim();
    this.movies = this.allMovies.filter(m => 
      m.title.toLowerCase().includes(lowerTerm) || 
      m.genre.toLowerCase().includes(lowerTerm)
    );
  }
}