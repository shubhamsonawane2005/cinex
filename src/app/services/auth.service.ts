import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:5000/api';
  private readonly authUrl = `${this.baseUrl}/auth`;
  private readonly bookingUrl = `${this.baseUrl}/bookings`;
  private readonly notifyUrl = `${this.baseUrl}/notify-me`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  // --- Authentication & Profile ---

  login(userData: any): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, userData);
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.authUrl}/signup`, userData);
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getUserDetails(email: string): Observable<any> {
    return this.http.get(`${this.authUrl}/user/${email}`);
  }

  updateProfile(email: string, data: any): Observable<any> {
    return this.http.put(`${this.authUrl}/update-profile/${email}`, data);
  }

  // --- Bookings ---

  saveBooking(data: any): Observable<any> {
    return this.http.post(`${this.bookingUrl}/save`, data);
  }

  getUserBookings(email?: string): Observable<any> {
    let userEmail = email;

    // Fallback to localStorage if email isn't provided
    if (!userEmail && isPlatformBrowser(this.platformId)) {
      userEmail = localStorage.getItem('userEmail') || '';
    }

    if (!userEmail) return of([]);

    return this.http.get(`${this.bookingUrl}/my-bookings/${userEmail}`);
  }

  cancelBooking(id: string): Observable<any> {
    return this.http.delete(`${this.bookingUrl}/cancel/${id}`);
  }

  // --- Notifications ---

  setupNotification(data: any): Observable<any> {
    return this.http.post(this.notifyUrl, data);
  }

  // --- Admin & Statistics ---

  getUserCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.authUrl}/user-count`);
  }

  getBookingCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.bookingUrl}/count`);
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.bookingUrl}/stats`);
  }

  getPagedBookings(page: number, limit: number): Observable<any> {
    return this.http.get(`${this.bookingUrl}/stats`, {
      params: { page: page.toString(), limit: limit.toString() },
    });
  }
}
