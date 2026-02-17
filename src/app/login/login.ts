import { Component, inject, PLATFORM_ID, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {


  private router = inject(Router);
  private http = inject(HttpClient);
  // SSR error se bachne ke liye PLATFORM_ID inject karein
  private platformId = inject(PLATFORM_ID);

  loginData = {
    email: '',
    password: ''
  };

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: '239208433902-6fj5dhqs58iggtm025973p71o3lngjqb.apps.googleusercontent.com',
        callback: (response: any) => this.handleLogin(response)
      });

      // Google Button render karne ke liye (agar HTML mein <div id="google-btn"></div> hai)
      // @ts-ignore
      google.accounts.id.renderButton(
        document.getElementById('google-btn'),
        { theme: 'outline', size: 'large' }
      );
    }
  }
  handleLogin(response: any) {
    const payload = JSON.parse(atob(response.credential.split('.')[1])); // Token decode
    console.log("Google User:", payload);

    const googleData = {
      username: payload.name,
      email: payload.email,
      googleId: payload.sub,    // Google ki unique ID
      profilePic: payload.picture
    };
    const apiUrl = 'http://localhost:5000/api/auth/google-login';
    this.http.post(apiUrl, googleData).subscribe({
      next: (res: any) => {
        console.log("Database updated via Google Login", res);

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.credential);
          localStorage.setItem('role', 'user');
          localStorage.setItem('userName', payload.name);

          alert(`Welcome ${payload.name}!`);
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error("Google Auth Error:", err);
        alert("Google login failed to sync with database.");
      }
    });
  }



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
