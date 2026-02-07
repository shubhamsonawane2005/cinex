import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-theaters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-theaters.html',
  styleUrl: './manage-theaters.css'
})
export class ManageTheatersComponent {
  
  showForm = false;
  isEditing = false;
  
  // Form Data (Showtimes is a string here for easy editing)
  theaterForm = {
    id: 0,
    name: '',
    location: '',
    mapUrl: '',
    showtimesInput: '' // We will split this string into an array later
  };

  // Mock Data (Matches your User Panel data)
  theaters = [
    { 
      id: 1, 
      name: 'PVR: Rahul Raj Mall', 
      location: 'Piplod, Surat', 
      showtimes: ['10:00 AM', '1:30 PM', '5:00 PM'],
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=PVR+Rahul+Raj+Mall+Surat' 
    },
    { 
      id: 2, 
      name: 'INOX: VR Mall', 
      location: 'Dumas Road, Surat', 
      showtimes: ['11:00 AM', '6:15 PM'],
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=INOX+VR+Mall+Surat' 
    }
  ];

  // --- ACTIONS ---

  openAddForm() {
    this.showForm = true;
    this.isEditing = false;
    this.resetForm();
  }

  editTheater(theater: any) {
    this.showForm = true;
    this.isEditing = true;
    // Copy data and convert Array -> String for the input box
    this.theaterForm = { 
      ...theater, 
      showtimesInput: theater.showtimes.join(', ') 
    };
  }

  deleteTheater(id: number) {
    if(confirm('Are you sure you want to remove this theater?')) {
      this.theaters = this.theaters.filter(t => t.id !== id);
    }
  }

  saveTheater() {
    // Convert String "10:00 AM, 1:00 PM" -> Array ["10:00 AM", "1:00 PM"]
    const showtimesArray = this.theaterForm.showtimesInput.split(',').map(s => s.trim());

    const theaterData = {
      id: this.theaterForm.id,
      name: this.theaterForm.name,
      location: this.theaterForm.location,
      mapUrl: this.theaterForm.mapUrl,
      showtimes: showtimesArray
    };

    if (this.isEditing) {
      const index = this.theaters.findIndex(t => t.id === theaterData.id);
      if (index !== -1) this.theaters[index] = theaterData;
    } else {
      theaterData.id = Date.now();
      this.theaters.push(theaterData);
    }
    this.closeForm();
  }

  closeForm() {
    this.showForm = false;
  }

  resetForm() {
    this.theaterForm = { id: 0, name: '', location: '', mapUrl: '', showtimesInput: '' };
  }
}