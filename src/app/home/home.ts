
import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Ye line add ki hai
import { MovieService, Movie } from '../services/movie';
import { MoviesRelese, ReleseMovie } from './relese.movie';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // <-- FormsModule yahan dalo
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  
  movies: any[] = []; // Movie[] ki jagah any[] kiya taaki theaterName add ho sake
  private movieService = inject(MovieService);
  
  relese: MoviesRelese[] = [];
  private movierelese = inject(ReleseMovie);

  slides: any[] = [];
  currentIndex: number = 0;

  ngOnInit() {
    this.movieService.getMovies().subscribe((data) => {
      // Har movie ke liye ek default theater set kar rahe hain
      this.movies = data.map(m => ({...m, theaterName: 'PVR: Rahul Raj Mall'}));
      this.slides = data; 
    });
      
    this.movierelese.getReleseMovies().subscribe((data) => {
      this.relese = data;
    });
  }

  next(): void {
    if (this.relese.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.relese.length;
    }
  }

  prev(): void {
    if (this.relese.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.relese.length) % this.relese.length;
    }
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }
}