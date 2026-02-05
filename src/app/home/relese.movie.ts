import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface MoviesRelese {
  id: number;
  title: string;
  genre: string;
  image: string;
  rating: string;
  year?: string;
  Duration:string;
  description?: string; // Optional description
  trailer?: string;     // Optional trailer link
}

@Injectable({
  providedIn: 'root'
})
export class ReleseMovie {

  private relese: MoviesRelese[] = [
    {
      id: 1,
      title: 'Pushpa 2: The Rule',
      genre: 'Action, Drama',
      image: 'https://tse2.mm.bing.net/th/id/OIP.DMa3vDB3k039qUUL7gW-rwHaLS?rs=1&pid=ImgDetMain&o=7&rm=3',
      rating: '9.5',
      description: 'Pushpa Raj returns to rule the red sandalwood smuggling syndicate in this intense sequel.',
      Duration: "192 min",
      year: '2025'
    },
    {
      id: 2,
      title: 'Border 2',
      genre: 'Action, Bollywood, Drama, War',
      rating: '9.5',
      image: 'https://img.inextlive.com/inext/2512026/border-2-real-locations.jpg',
      description: 'During the events of the 1971 Indo-Pak war, a new generation of young Indian warriors were getting ready to defend the nation from an even bigger threat to the Indian motherland.',
      Duration: "192 min",
      year: '2026',
      
    },
    {
      id: 3,
      title: 'Jawan',
      genre: 'Action, Thriller',
      rating: '9.5',
      image: 'https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg',
      description: 'A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.',
      Duration: "192 min",
      year: '2024'
    },
    {
      id: 4,
      title: 'Dune: Part Two',
      genre: 'Sci-Fi, Adventure',
      rating: '9.5',
      image: 'https://i.pinimg.com/736x/ed/5e/99/ed5e9926e3b45827e57f2d723bb693dc.jpg',
      description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
      Duration: "192 min",
      year: '2025'
    }
  ];
  // 1. Inside the Class, add this new array:
  // private upcomingMovies: ReleseMovie[] = [
  //   { 
  //     id: 101, 
  //     title: 'Avatar: Fire and Ash', 
  //     genre: 'Sci-Fi | Adventure', 
  //     image: 'https://image.tmdb.org/t/p/w500/t6HIqrKwXjgj8995d9z9uaL8kI2.jpg', 
  //     year: 'Dec 2025',
  //     description: 'The third installment in the Avatar franchise.'
  //   },
  //   { 
  //     id: 102, 
  //     title: 'Superman: Legacy', 
  //     genre: 'Action | Sci-Fi', 
  //     image: 'https://image.tmdb.org/t/p/w500/zVMyvNowgbsBAL6O6esWfRpAcOb.jpg', 
  //     year: 'July 2025',
  //     description: 'A new beginning for the Man of Steel.'
  //   },
  //   { 
  //     id: 103, 
  //     title: 'The Batman - Part II', 
  //     genre: 'Crime | Drama', 
  //     image: 'https://image.tmdb.org/t/p/w500/c5Tqxeo1UpBvnAc3csW7lcIopCp.jpg', 
  //     year: 'Oct 2026',
  //     description: 'Bruce Wayne returns to fight crime in Gotham.'
  //   }
  // ];

  // 2. Add this function to fetch them:
  // getUpcomingMovies(): Observable<ReleseMovie[]> {
  //   return of(this.upcomingMovies);
  // }
  //   // 1. Get All Movies
  //   getMovies() {
  //     return of(this.movies);
  //   }

  // 2. Get Single Movie (THIS WAS MISSING)
  //   getMovieById(id: number) {
  //     const relesemovie = this.movie.find(m => m.id === id);
  //     return of(relesemovie);
  //   }
  getReleseMovies(): Observable<MoviesRelese[]> {
    return of(this.relese);
  }
}