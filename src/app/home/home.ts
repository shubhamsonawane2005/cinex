import { Component, OnInit, inject ,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../services/movie';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {

  movies: any[] = [];
  slides: any[] = [];
  currentIndex: number = 0;
  
  private movieService = inject(MovieService);
  private cd = inject(ChangeDetectorRef);
  movies$: Observable<any[]> = this.movieService.getMovies();

  loading: boolean = true;
  ngOnInit(): void {
    this.movieService.getMovies().subscribe({
    next: (data) => {
      this.movies = data;
      this.slides = data;
      this.loading = false; 
      this.cd.detectChanges();
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
      this.cd.detectChanges();
    }
  });
  }

  next(): void {
    if (this.slides.length > 0) {
      this.currentIndex =
        (this.currentIndex + 1) % this.slides.length;
    }
  }

  prev(): void {
    if (this.slides.length > 0) {
      this.currentIndex =
        (this.currentIndex - 1 + this.slides.length) %
        this.slides.length;
    }
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  getDescription(movie: any): string {
    if (movie?.description) {
      return movie.description;
    }

    return `Experience the thrill of ${movie.genre}. Book your tickets now and enjoy ${movie.title} on the big screen.`;
  }
}