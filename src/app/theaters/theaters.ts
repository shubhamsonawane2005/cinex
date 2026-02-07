import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router"; 

// 1. Define what a Theater looks like
interface Theater {
  id: number;
  name: string;
  location: string;
  showtimes: string[];
  mapUrl: string; // <--- The map button link
}

@Component({
  selector: 'app-theaters',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './theaters.html',
  styleUrl: './theaters.css'
})
export class TheatersComponent {

  // 2. Updated list for SURAT
  theaters: Theater[] = [
    {
      id: 1,
      name: 'PVR: Rahul Raj Mall',
      location: 'Piplod, Dumas Road, Surat',
      showtimes: ['10:00 AM', '1:30 PM', '5:00 PM', '9:00 PM'],
      // Real Location Link
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=PVR+Rahul+Raj+Mall+Surat'
    },
    {
      id: 2,
      name: 'INOX: VR Mall',
      location: 'Dumas Road, Magdalla, Surat',
      showtimes: ['11:00 AM', '2:00 PM', '6:15 PM', '10:30 PM'],
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=INOX+VR+Mall+Surat'
    },
    {
      id: 3,
      name: 'Cinépolis: Imperial Square',
      location: 'Adajan Gam, Surat',
      showtimes: ['9:30 AM', '12:45 PM', '4:30 PM', '8:15 PM'],
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cinepolis+Imperial+Square+Mall+Surat'
    },
    {
      id: 4,
      name: 'Rajhans Multiplex',
      location: 'Pal Hazira Road, Adajan, Surat',
      showtimes: ['10:15 AM', '1:45 PM', '5:30 PM', '9:45 PM'],
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rajhans+Cinema+Pal+Adajan+Surat'
    }
  ];

}