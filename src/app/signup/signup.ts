// import { Component } from '@angular/core';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-signup',
//   standalone: true,
//   imports: [RouterModule],
//   templateUrl: './signup.html',
//   styleUrl: './signup.css' 
// })
// export class SignupComponent {}

import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service'; // Path sahi check kar lena

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css' 
})
export class SignupComponent {
  private router = inject(Router);
  private authService = inject(AuthService); // Service use kar rahe hain

  signupData = {
    username: '',
    email: '',
    password: ''
  };

  onSignup() {
    // Service ko call kar rahe hain
    this.authService.signup(this.signupData).subscribe({
      next: (res) => {
        console.log("Signup success!", res);
        alert("Account Created Successfully!");
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        console.error("Signup error", err);
        // Agar backend se message aata hai toh wo dikhayega
        alert(err.error?.message || "Signup failed. Try again.");
      }
    });
  }
}