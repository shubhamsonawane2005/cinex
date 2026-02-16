// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   // Backend URL (Make sure your node server is running on 5000)
//   private apiUrl = 'http://localhost:5000/api/auth';

//   constructor(private http: HttpClient) { }

//   // Signup API Call
//   signup(userData: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/signup`, userData);
//   }
// }
// // 

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

  // --- NAYA CODE YAHAN SE HAI (LOGIN STATUS CHECK KARNE KE LIYE) ---
  
  isLoggedIn(): boolean {
    // Ye check karega ki browser ki storage mein 'token' naam ki cheez hai ya nahi
    // Agar token hai, toh iska matlab user login hai
    return !!localStorage.getItem('token'); 
  }
}