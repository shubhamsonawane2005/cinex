import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  image: string;
  year?: string;
  description?: string; // Optional description
  trailer?: string;     // Optional trailer link
}

@Injectable({ 
  providedIn: 'root'
})
export class MovieService {

  private movies: Movie[] = [
    {
      id: 1,
      title: 'Pushpa 2: The Rule',
      genre: 'Action, Drama',
      rating: 8.9,
      image: 'https://tse2.mm.bing.net/th/id/OIP.DMa3vDB3k039qUUL7gW-rwHaLS?rs=1&pid=ImgDetMain&o=7&rm=3',
      description: 'Pushpa Raj returns to rule the red sandalwood smuggling syndicate in this intense sequel.',
      year: '2025'
    },
    {
      id: 2,
      title: 'Oppenheimer',
      genre: 'Biography, Drama',
      rating: 9.2,
      image: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg',
      description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
      year: '2023'
    },
    {
      id: 3,
      title: 'Jawan',
      genre: 'Action, Thriller',
      rating: 8.5,
      image: 'https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg',
      description: 'A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.',
      year: '2024'
    },
    {
      id: 4,
      title: 'Dune: Part Two',
      genre: 'Sci-Fi, Adventure',
      rating: 8.8,
      image: 'https://i.pinimg.com/736x/ed/5e/99/ed5e9926e3b45827e57f2d723bb693dc.jpg',
      description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
      year: '2025'
    },
    { 
      id: 5, 
      title: 'Inside Out 2', 
      genre: 'Animation | Family', 
      image: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg', 
      rating: 8.2, year: '2024'
    },
    { 
      id: 6, 
      title: 'IKKIS', 
      genre: 'Action | Family', 
      image: 'https://images.timesnownews.com/photo/msid-153300930/153300930.jpg', 
      rating: 7.8, year: '2024'
    },
    { 
      id: 7, 
      title: 'Moana 2', 
      genre: 'Animation | Adventure', 
      image: 'https://image.tmdb.org/t/p/w500/hUGVinRz94xl5l1Jgh9V8n30qE5.jpg', 
      rating: 7.6, year: '2024'
    },
    { 
      id: 8, 
      title: 'Wicked', 
      genre: 'Fantasy | Musical', 
      image: 'https://image.tmdb.org/t/p/w500/c5Tqxeo1UpBvnAc3csW7lcIopCp.jpg', 
      rating: 7.9, year: '2024'
    }
  ];
// 1. Inside the Class, add this new array:
private upcomingMovies: Movie[] = [
  { 
    id: 101, 
    title: 'Avatar: Fire and Ash', 
    genre: 'Sci-Fi | Adventure', 
    image: 'https://image.tmdb.org/t/p/w500/t6HIqrKwXjgj8995d9z9uaL8kI2.jpg', 
    rating: 0, 
    year: 'Dec 2025',
    description: 'The third installment in the Avatar franchise.'
  },
  { 
    id: 102, 
    title: 'Superman: Legacy', 
    genre: 'Action | Sci-Fi', 
    image: 'https://image.tmdb.org/t/p/w500/zVMyvNowgbsBAL6O6esWfRpAcOb.jpg', 
    rating: 0, 
    year: 'July 2025',
    description: 'A new beginning for the Man of Steel.'
  },
  { 
    id: 103, 
    title: 'The Batman - Part II', 
    genre: 'Crime | Drama', 
    image: 'https://image.tmdb.org/t/p/w500/c5Tqxeo1UpBvnAc3csW7lcIopCp.jpg', 
    rating: 0, 
    year: 'Oct 2026',
    description: 'Bruce Wayne returns to fight crime in Gotham.'
  }
];

// 2. Add this function to fetch them:
getUpcomingMovies(): Observable<Movie[]> {
  return of(this.upcomingMovies);
}
  // 1. Get All Movies
  getMovies() {
    return of(this.movies);
  }

  // 2. Get Single Movie (THIS WAS MISSING)
  getMovieById(id: number) {
    const movie = this.movies.find(m => m.id === id);
    return of(movie);
  }
}