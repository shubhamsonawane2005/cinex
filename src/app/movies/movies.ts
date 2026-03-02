import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router, NavigationEnd } from '@angular/router'; // NavigationEnd add karein
import { MovieService, Movie } from '../services/movie';
import { filter } from 'rxjs/operators'; // filter import karein

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movies.html',
  styleUrl: './movies.css',
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];
  allMovies: Movie[] = []; // Backup for filtering

  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    // 1. Navbar click par reload karne ke liye logic
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.loadAllMovies();
    });
  }

  ngOnInit() {
    this.loadAllMovies();
  }

  loadAllMovies() {
    this.movieService.getMovies().subscribe((data) => {
      this.allMovies = data;
      this.movies = data;
      this.cdr.detectChanges();
      this.checkQueryParams();

      
      this.route.queryParams.subscribe((params) => {
        const searchTerm = params['q'];
        if (searchTerm) {
          this.filterMovies(searchTerm);
        } else {
          this.movies = [...this.allMovies];
        }
      });
    });
  }

  checkQueryParams() {
    this.route.queryParams.subscribe((params) => {
      const searchTerm = params['q'];
      if (searchTerm) {
        this.filterMovies(searchTerm);
      } else {
        this.movies = [...this.allMovies];
      }
      this.cdr.detectChanges(); 
    });
  }

  filterMovies(term: string) {
    if (!term.trim()) {
      this.movies = [...this.allMovies];
      return;
    }

    const lowerTerm = term.toLowerCase().trim();
    this.movies = this.allMovies.filter(
      (m) => m.title.toLowerCase().includes(lowerTerm) || m.genre.toLowerCase().includes(lowerTerm),
    );
  }
}
