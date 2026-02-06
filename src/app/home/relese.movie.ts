import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface MoviesRelese {
  id: number;
  title: string;
  genre: string;
  image: string;
  backdrop?: string;
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
      title: 'Avatar: Fire and Ash', 
      genre: 'Sci-Fi | Adventure', 
      image: 'avatar.jpg', 
      backdrop: 'avatar-banner.jpg',
      rating: '8.9', 
      year: '2025',
      Duration: '3h 12m',
      trailer: 'https://www.youtube.com/embed/Eb2TjJr21Nk',
      description: 'Jake Sully and Neytiri encounter the Ash People, a new clan of Na’vi who are more aggressive and fire-obsessed.'
    },
    {
      id: 2, 
      title: 'Scream 7', 
      genre: 'Horror | Mystery', 
      image: 'scream7.jpg',
       backdrop : 'scream7-banner.jpg', 
      rating: '7.4', 
      year: '2026',
      Duration: '1h 54m',
      trailer: 'https://www.youtube.com/embed/0QdDjriUuh0', 
      description: 'Sidney Prescott must face the horrors of her past again when a new Ghostface emerges, targeting her daughter in a quiet new town.' 
    },
    {
      id: 3, 
      title: 'Dhurandhar', 
      genre: 'Action | Thriller | Spy', 
      image: 'dhurandhar.jpg', 
      backdrop: 'dhurandhar-banner.jpg',
      rating: '8.8', 
      year: '2025', 
      Duration: '3h 34m',
      trailer: 'https://www.youtube.com/embed/zLGs16m8QJo', 
      description: 'An Indian intelligence agent (Ranveer Singh) goes deep undercover in Pakistan to dismantle a terror network from within, risking everything to prevent a catastrophic attack.'},
    {
      id: 4, 
      title: 'Zootopia 2', 
      genre: 'Animation | Family', 
      image: 'zootopia2.jpg', 
       backdrop : 'zootopia2-banner.jpg',
      rating: '7.8', 
      year: '2025',
      Duration: '1h 42m', 
      trailer: 'https://www.youtube.com/embed/2p3yiP2RxhM', 
      description: 'Detectives Judy Hopps and Nick Wilde go undercover to crack a case involving a mysterious reptile syndicate turning the city upside down.'
     },
     {
      id: 5, 
      title: 'Mardaani 3', 
      genre: 'Crime | Thriller', 
      image: 'mardani3.jpg',
      backdrop : 'mardaani-3-poster.jpg', 
      rating: '8.0', 
      year: '2026',
      Duration: '2h 15m',
      trailer: 'https://www.youtube.com/embed/ghi012', 
      description: 'Shivani Shivaji Roy (Rani Mukerji) faces her toughest challenge yet, taking on a specialized crime syndicate targeting women.'
     },
     {
      id: 6, 
      title: 'Border 2', 
      genre: 'War | Action', 
      image: 'border2.jpg',
      backdrop : 'border2-banner.jpg',
      rating: '9.1', 
      year: '2026',
      Duration: '2h 45m',
      trailer: 'https://www.youtube.com/embed/xyz123', 
      description: 'Sunny Deol returns in this massive war sequel, leading a new battalion to defend the Longewala post against a fresh enemy threat.'
     }
     
  ];
  // 1. Inside the Class, add this new array:
  /* private upcomingMovies: ReleseMovie[] = [
      { 
      id: 1, 
      title: 'The Mandalorian & Grogu', 
      genre: 'Sci-Fi | Action', 
      image: 'mandalorain.jpg', 
      rating: '0', 
      year: 'May 2026',
      Duration: 'TBA',
      trailer: 'https://www.youtube.com/embed/xJ8j-C5_tBQ', 
      description: 'Din Djarin and Grogu embark on a new adventure in this theatrical continuation of the Star Wars series.'
    },
    { 
      id: 2, 
      title: 'Toy Story 5', 
      genre: 'Animation | Family', 
      image: 'toystory5.jpg', 
      rating: '0', 
      year: 'June 2026',
      Duration: 'TBA',
      trailer: 'https://www.youtube.com/embed/wmiIUN-7qhE',
      description: 'Woody and Buzz reunite for an all-new adventure that explores the impact of technology on play.'
    },
    { 
      id: 3, 
      title: 'Mirzapur: The Movie', 
      genre: 'Crime | Thriller', 
      image: 'mirzapur.jpg', 
      rating: '0', 
      year: 'Sept 2026',
      Duration: 'TBA',
      trailer: 'https://www.youtube.com/embed/xJ8j-C5_tBQ', 
      description: 'The King of Mirzapur, Kaleen Bhaiya, returns to reclaim his throne in this theatrical expansion of the hit series.'
    },
    { 
      id: 4, 
      title: 'Avengers: Doomsday', 
      genre: 'Action | Sci-Fi', 
      image: 'avenger.jpg', 
      rating: '0', 
      year: 'Dec 2026',
      Duration: 'TBA',
      trailer: 'https://www.youtube.com/embed/vJK7Q1uHDjo',
      description: 'Earth\'s Mightiest Heroes must assemble once more to face their greatest threat yet: Doctor Doom.'
    } 
   ]; */

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