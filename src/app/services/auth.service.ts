
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Backend URL (Make sure your node server is running on 5000)
  private apiUrl = 'http://localhost:5000/api/auth';
  private bookingUrl = 'http://localhost:5000/api/bookings';
  private notifyUrl = 'http://localhost:5000/api/notify-me'; // Notify Me ke liye naya URL

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // Login API Call (Iske bina 404 aa raha tha)
  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, userData);
  }

  // Signup API Call
  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  // Notify Me API Call (Subham's Task)
  setupNotification(data: any): Observable<any> {
    return this.http.post(this.notifyUrl, data);
  }

  // --- NAYA CODE YAHAN SE HAI (LOGIN STATUS CHECK KARNE KE LIYE) ---

  isLoggedIn(): boolean {
    // Check karein ki kya hum Browser mein hain?
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }

    // Agar hum Server (SSR) par hain, toh default 'false' return karein
    return false;
  }

  getUserCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/user-count`);
  }

  saveBooking(data: any) {
    return this.http.post(`${this.bookingUrl}/save`, data);
  }

  getBookingCount(): Observable<{ count: number }> {
    // Backend URL matches: http://localhost:5000/api/bookings/count
    return this.http.get<{ count: number }>(`${this.bookingUrl}/count`);
  }

  getDashboardStats(page:number,limit:number): Observable<any> {
    return this.http.get(`${this.bookingUrl}/stats`);
  }

  getPagedBookings(page: number, limit: number): Observable<any> {
    return this.http.get(`${this.bookingUrl}/stats?page=${page}&limit=${limit}`);
  }
}