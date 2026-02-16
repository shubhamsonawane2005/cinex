import { Component, inject, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { HttpClient, HttpClientModule } from '@angular/common/http'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, HttpClientModule], 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  
  private router = inject(Router);
  private http = inject(HttpClient);
  // SSR error se bachne ke liye PLATFORM_ID inject karein
  private platformId = inject(PLATFORM_ID);

  loginData = {
    email: '',
    password: ''
  };

  onLogin() {
    // Check karein ki browser hai ya nahi (localStorage ke liye)
    const isBrowser = isPlatformBrowser(this.platformId);

    // --- ADMIN CHECK START ---
    if (this.loginData.email === 'admin@gmail.com' && this.loginData.password === 'admin123') {
      if (isBrowser) {
        localStorage.setItem('token', 'admin-secret-token');
        localStorage.setItem('role', 'admin'); 
      }
      alert("Welcome Admin!");
      this.router.navigate(['/admin/dashboard']); 
      return;
    }
    // --- ADMIN CHECK END ---

    const apiUrl = 'http://localhost:5000/api/auth/login';

    this.http.post(apiUrl, this.loginData).subscribe({
      next: (response: any) => {
        if (isBrowser) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', 'user');
        }
        alert("Welcome Back!");
        this.router.navigate(['/']); // Normal user home page jayega
      },
      error: (err) => {
        console.error("Login Error:", err);
        alert("Invalid Email or Password!");
      }
    });
  }
}