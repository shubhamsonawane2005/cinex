// src/app/models/movie.model.ts

export interface Movie {
  // MongoDB automatically generates a unique '_id' field as a string.
  // We use '?' to make it optional, as new movies won't have an ID until saved to the database.
  _id?: string; 
  
  title: string;
  genre: string;
  image: string; // URL to the poster
  
  // Status to define if the movie is currently showing or upcoming
  status: 'released' | 'upcoming';
  
  // Optional: Array to store nested showtimes data if necessary
  showtimes?: any[]; 
}