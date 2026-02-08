import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- INTERFACES ---
interface ScheduledMovie {
  title: string;
  image: string;
  times: { time: string, bookedCount: number, totalSeats: number }[];
}

interface Theater {
  id: number;
  name: string;
  location: string;
  facilities: string;
  movies: ScheduledMovie[];
}

@Component({
  selector: 'app-manage-theaters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-theaters.html',
  styleUrls: ['./manage-theaters.css']
})
export class ManageTheatersComponent {

  // --- UI STATE ---
  showInspector = false;
  showForm = false; // Controls Add Modal

  // --- INSPECTOR VARIABLES ---
  inspectTheaterName: string = '';
  inspectMovieTitle: string = '';
  inspectTime: string = '';
  
  // Mock Seat Data
  rows: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];
  leftSeats = [1, 2, 3, 4];
  rightSeats = [5, 6, 7, 8];
  bookedSeats: string[] = []; 

  // --- FORM DATA ---
  theaterForm: Theater = { id: 0, name: '', location: '', facilities: '', movies: [] };

  // --- THEATER DATA (Mock) ---
  theaters: Theater[] = [
    {
      id: 1,
      name: 'PVR: Rahul Raj Mall',
      location: 'Piplod, Surat',
      facilities: 'Dolby Atmos, Recliners',
      movies: [
        {
          title: 'Border 2',
          image: 'https://placehold.co/100x150/333/FFF?text=Border+2',
          times: [
            { time: '10:00 AM', bookedCount: 42, totalSeats: 48 },
            { time: '02:00 PM', bookedCount: 12, totalSeats: 48 }
          ]
        },
        {
          title: 'Superman: Legacy',
          image: 'https://placehold.co/100x150/2563eb/FFF?text=Superman',
          times: [
            { time: '05:30 PM', bookedCount: 5, totalSeats: 48 }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'INOX: VR Mall',
      location: 'Dumas Rd, Surat',
      facilities: 'IMAX, Laser',
      movies: [
        {
          title: 'Border 2',
          image: 'https://placehold.co/100x150/333/FFF?text=Border+2',
          times: [
            { time: '11:00 AM', bookedCount: 20, totalSeats: 48 },
            { time: '06:00 PM', bookedCount: 48, totalSeats: 48 }
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'Cinépolis: Imperial Square',
      location: 'Adajan, Surat',
      facilities: '4DX, Coffee Shop',
      movies: []
    },
    {
      id: 4,
      name: 'Rajhans Multiplex',
      location: 'Pal, Surat',
      facilities: 'Budget Friendly',
      movies: [
        {
          title: 'Mickey 17',
          image: 'https://placehold.co/100x150/1a1a1a/FFF?text=Mickey+17',
          times: [
            { time: '09:00 PM', bookedCount: 0, totalSeats: 48 }
          ]
        }
      ]
    }
  ];

  // --- ACTIONS ---

  openAddForm() {
    this.showForm = true;
    // Reset Form
    this.theaterForm = { id: 0, name: '', location: '', facilities: '', movies: [] };
  }

  closeForm() {
    this.showForm = false;
  }

  saveTheater() {
    if (this.theaterForm.name && this.theaterForm.location) {
      this.theaterForm.id = Date.now(); // Generate ID
      this.theaters.push({ ...this.theaterForm }); // Add to list
      this.closeForm();
    }
  }

  deleteTheater(id: number) {
    if(confirm('Are you sure you want to remove this theater?')) {
      this.theaters = this.theaters.filter(t => t.id !== id);
    }
  }

  // --- INSPECTOR ACTIONS ---

  openInspector(theaterName: string, movieTitle: string, timeData: any) {
    this.inspectTheaterName = theaterName;
    this.inspectMovieTitle = movieTitle;
    this.inspectTime = timeData.time;
    this.showInspector = true;
    
    // Generate mock booked seats based on count
    this.generateMockSeatMap(timeData.bookedCount);
  }

  closeInspector() {
    this.showInspector = false;
    this.bookedSeats = [];
  }

  generateMockSeatMap(count: number) {
    this.bookedSeats = [];
    const allSeats: string[] = [];
    
    this.rows.forEach(r => {
      [...this.leftSeats, ...this.rightSeats].forEach(n => allSeats.push(r + n));
    });

    for (let i = allSeats.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allSeats[i], allSeats[j]] = [allSeats[j], allSeats[i]];
    }
    this.bookedSeats = allSeats.slice(0, count);
  }

  isBooked(row: string, num: number): boolean {
    return this.bookedSeats.includes(row + num);
  }

  getOccupancyColor(booked: number, total: number): string {
    const percentage = booked / total;
    if (percentage >= 0.8) return '#dc3545'; // Red
    if (percentage >= 0.5) return '#ffc107'; // Yellow
    return '#28a745'; // Green
  }
}