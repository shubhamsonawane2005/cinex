import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService, Movie } from '../services/movie';

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

  ngOnInit() {
    this.movieService.getUpcomingMovies().subscribe(data => {
      this.upcomingMovies = data;
    });
  }
}