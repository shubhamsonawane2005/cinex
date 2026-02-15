import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Backend URL (Make sure your node server is running on 5000)
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) { }

  // Signup API Call
  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }
}