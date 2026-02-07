import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 1. Define an Interface for Type Safety
export interface Movie {
  id: number;
  title: string;
  image: string;
  backdrop: string;
  genre: string;
  rating: number;
  releaseDate: string;
  description: string;
  status: 'released' | 'upcoming'; // Strict type
}

@Component({
  selector: 'app-manage-movies',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './manage-movies.html',
  styleUrl: './manage-movies.css' // Note: Use styleUrls: [...] if on Angular <17
})
export class ManageMoviesComponent {
  
  // 2. Tab State
  activeTab: 'released' | 'upcoming' = 'released';
  activeFormTab: 'basic' | 'media' = 'basic';

  showForm = false;
  isEditing = false;

  // 3. Initialize Form with Default Values matching the Interface
  movieForm: Movie = {
    id: 0,
    title: '',
    image: '',
    backdrop: '',
    genre: '',
    rating: 0,
    releaseDate: '',
    description: '',
    status: 'released'
  };

  // 4. Mock Data (Typed)
  allMovies: Movie[] = [
    { 
      id: 1, 
      title: 'Border 2', 
      genre: 'War', 
      rating: 9.1, 
      status: 'released', 
      image: 'border2.jpg', 
      backdrop: 'border2-banner.jpg', 
      releaseDate: '', 
      description: 'The sequel to the classic war movie.' 
    },
    { 
      id: 2, 
      title: 'Dhurandhar', 
      genre: 'Spy', 
      rating: 8.8, 
      status: 'released', 
      image: 'dhurandhar.jpg', 
      backdrop: '', 
      releaseDate: '', 
      description: '' 
    },
    { 
      id: 3, 
      title: 'Avenger:Doomsday', 
      genre: 'Sci-Fi/superhero', 
      rating: 0, 
      status: 'upcoming', 
      image: 'avenger.jpg', 
      backdrop: '', 
      releaseDate: '2025-07-11', 
      description: '' 
    }
  ];

  // 5. Getter for Filtering
  get filteredMovies() {
    return this.allMovies.filter(m => m.status === this.activeTab);
  }

  // --- ACTIONS ---

  openAddForm() {
    this.showForm = true;
    this.isEditing = false;
    this.activeFormTab = 'basic';
    
    this.resetForm();
    // Default the new movie status to the tab the user is currently looking at
    this.movieForm.status = this.activeTab; 
  }

  editMovie(movie: Movie) {
    this.showForm = true;
    this.isEditing = true;
    this.activeFormTab = 'basic';
    // Create a copy so we don't mutate the list directly while typing
    this.movieForm = { ...movie };
  }

  deleteMovie(id: number) {
    if(confirm('Delete this movie?')) {
      this.allMovies = this.allMovies.filter(m => m.id !== id);
    }
  }

  saveMovie() {
    // 6. Immutability: Create new array references to trigger UI updates
    if (this.isEditing) {
      this.allMovies = this.allMovies.map(m => 
        m.id === this.movieForm.id ? { ...this.movieForm } : m
      );
    } else {
      this.movieForm.id = Date.now(); // Generate ID
      this.allMovies = [...this.allMovies, { ...this.movieForm }];
    }
    
    this.closeForm();
  }

  closeForm() { 
    this.showForm = false; 
  }
  
  resetForm() {
    this.movieForm = { 
      id: 0, 
      title: '', 
      image: '', 
      backdrop: '', 
      genre: '', 
      rating: 0, 
      releaseDate: '', 
      description: '', 
      status: 'released' 
    };
  }
}