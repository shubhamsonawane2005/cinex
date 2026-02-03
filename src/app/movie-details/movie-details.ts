import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router'; 
import { MovieService, Movie } from '../services/movie';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css'
})
export class MovieDetailsComponent implements OnInit {

  movie: Movie | undefined;
  
  // 1. Cast Data (Static for now)
  cast = [
    { name: 'Cillian Murphy', role: 'Oppenheimer', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Cillian_Murphy_Press_Conference_The_Party_Berlinale_2017_02cr.jpg' },
    { name: 'Robert Downey Jr.', role: 'Lewis Strauss', image: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg' },
    { name: 'Emily Blunt', role: 'Kitty', image: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Emily_Blunt_by_Gage_Skidmore_2.jpg' },
    { name: 'Matt Damon', role: 'Leslie Groves', image: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Damon_Matt_2009_Venice_Film_Festival.jpg' },
    { name: 'Florence Pugh', role: 'Jean Tatlock', image: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Florence_Pugh_SDCC_2019.jpg' }
  ];

  // Make sure your Similar Movies also have full URLs
  // (In your loadMovie function, ensure the 'image' property is a full URL like 'https://...')

  // 2. Dates for the Booking Strip
 dates = [
    { day: '11', month: 'Jan', active: true },
    { day: '12', month: 'Jan', active: false },
    { day: '13', month: 'Jan', active: false },
    { day: '14', month: 'Jan', active: false }
  ];

  // <--- ADD THIS FUNCTION
  selectDate(index: number) {
    // 1. Reset all dates to false
    this.dates.forEach(d => d.active = false);
    
    // 2. Set the clicked date to true
    this.dates[index].active = true;
  }
scrollToBooking() {
  const element = document.getElementById('booking-section');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
  // 3. Similar Movies (We reuse existing movies for demo)
  similarMovies: Movie[] = [];

  private route = inject(ActivatedRoute); 
  private movieService = inject(MovieService); 
// Add this method inside your MovieDetailsComponent class

  ngOnInit() {
    // Get ID from URL
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadMovie(id);
      }
    });
  }

  loadMovie(id: number) {
    // Fetch Main Movie
    this.movieService.getMovieById(id).subscribe(data => {
      this.movie = data;
    });

    // Fetch Similar Movies (Just showing all movies as recommendations for now)
    this.movieService.getMovies().subscribe(data => {
      this.similarMovies = data.filter(m => m.id !== id); // Exclude current movie
    });
  }
}