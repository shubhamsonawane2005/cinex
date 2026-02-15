import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Booking {
  movieTitle: string;
  theater: string;
  date: string;
  seats: string[];
  amount: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  mobile: string;
  totalSpent: number;
  bookingHistory: Booking[];
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserListComponent {
  selectedUser: User | null = null;

  // Frontend Mock Data: Simulating the registration and booking history
  users: User[] = [
    { 
      id: 1, 
      username: 'Rahul Sharma', 
      email: 'rahul@example.com', 
      mobile: '9876543210', 
      totalSpent: 1250, // This user is valuable
      bookingHistory: [
        { movieTitle: 'Border 2', theater: 'PVR: Rahul Raj Mall', date: '2026-02-12', seats: ['A1', 'A2'], amount: 500 },
        { movieTitle: 'Superman: Legacy', theater: 'INOX: VR Mall', date: '2026-02-15', seats: ['C5', 'C6', 'C7'], amount: 750 }
      ]
    },
    { 
      id: 2, 
      username: 'Priya Patel', 
      email: 'priya@mail.com', 
      mobile: '9988776655', 
      totalSpent: 250,
      bookingHistory: [
        { movieTitle: 'Border 2', theater: 'Rajhans Multiplex', date: '2026-02-13', seats: ['E1'], amount: 250 }
      ]
    }
  ];

  viewHistory(user: User) {
    this.selectedUser = user;
  }

  closeHistory() {
    this.selectedUser = null;
  }
}