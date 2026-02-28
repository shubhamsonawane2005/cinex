import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

export interface Movie {
  _id: string;
  title: string;
  genre: string;
  rating: string;
  Duration: string;
  image: string;
  backdrop?: string;
  year?: string;
  description?: string; // Optional description
  trailer?: string; // Optional trailer link
  status?: 'released' | 'upcoming';
}

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private http = inject(HttpClient);
  
  private moviesSubject = new BehaviorSubject<Movie[]>([]);
  movies$ = this.moviesSubject.asObservable();

  private apiUrl = 'http://localhost:5000/api/movies';

  // get All movie
  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  // Get upcomming movie
  getUpComingMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/upcoming`);
  }

  addUpcomingMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(`${this.apiUrl}/upcoming`, movie);
  }
  // get single movie by ID
  getMovieById(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  // add new movie
  addMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(this.apiUrl, movie);
  }

  // update Movie
  updateMovie(movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/${movie._id}`, movie);
  }

  // delete Movie
  deleteMovie(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  refreshMovies() {
  this.getMovies().subscribe((movies) => {
    this.moviesSubject.next(movies);
  });
}
}
