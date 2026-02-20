import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-all-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-bookings.html',
  styleUrl: './all-bookings.css'
})
export class AllBookingsComponent implements OnInit {
  bookings: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 5; // Ek page par 5 records dikhayenge

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadBookings(this.currentPage);
  }

  loadBookings(page: number) {
    this.authService.getPagedBookings(page, this.limit).subscribe(res => {
      if (res.success) {
        this.bookings = res.data;
        this.totalPages = res.totalPages;
        this.currentPage = res.currentPage;
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadBookings(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadBookings(this.currentPage - 1);
    }
  }
}