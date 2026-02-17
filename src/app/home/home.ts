// import { Component, OnInit, inject, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { MovieService, Movie } from '../services/movie';
// import { MoviesRelese, ReleseMovie } from './relese.movie';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './home.html',
//   styleUrl: './home.css'
// })
// export class HomeComponent implements OnInit {
  
//   movies: Movie[] = [];
//   private movieService = inject(MovieService);
  
//   relese: MoviesRelese[] = [];
//   private  movierelese = inject(ReleseMovie);

//   // This will hold the data for your slider
//   slides: any[] = [];
//   currentIndex: number = 0;

//   ngOnInit() {
//     this.movieService.getMovies().subscribe((data) => {
//       this.movies = data;
//       // Populate slides with the movie data once it arrives
//       this.slides = data; 
//     });
      
//       this.movierelese.getReleseMovies().subscribe((data) => {
//       this.relese = data;
//     });
//   }


//   next(): void {
//     if (this.slides.length > 0) {
//       this.currentIndex = (this.currentIndex + 1) % this.relese.length;
//     }
//   }

//   prev(): void {
//     if (this.slides.length > 0) {
//       this.currentIndex = (this.currentIndex - 1 + this.relese.length) % this.relese.length;
//     }
//   }

//   goToSlide(index: number): void {
//     this.currentIndex = index;
//   }
// }
import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService, Movie } from '../services/movie';
import { MoviesRelese, ReleseMovie } from './relese.movie';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  
  movies: Movie[] = [];
  private movieService = inject(MovieService);
  
  relese: MoviesRelese[] = [];
  private movierelese = inject(ReleseMovie);

  // This will hold the data for your slider
  slides: any[] = [];
  currentIndex: number = 0;

  ngOnInit() {
    this.movieService.getMovies().subscribe((data) => {
      this.movies = data;
      // Populate slides with the movie data once it arrives
      this.slides = data; 
    });
      
    this.movierelese.getReleseMovies().subscribe((data) => {
      this.relese = data;
    });
  }

  next(): void {
    if (this.slides.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.relese.length;
    }
  }

  prev(): void {
    if (this.slides.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.relese.length) % this.relese.length;
    }
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }
}