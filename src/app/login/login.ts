// import { Component, inject } from '@angular/core'; // <--- Import inject
// import { Router, RouterModule } from '@angular/router'; // <--- Import Router

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [RouterModule], 
//   templateUrl: './login.html',
//   styleUrl: './login.css'
// })
// export class LoginComponent {
  
//   // 1. Get access to the Router
//   private router = inject(Router);

//   // 2. Create a function to handle the click
//   onLogin() {
//     // (Here you would normally check email/password)
//     console.log("Login Successful");
    
//     // 3. Navigate to Home Page
//     this.router.navigate(['/']); 
//   }
// }
import { Component, inject } from '@angular/core';
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

  loginData = {
    email: '',
    password: ''
  };

  onLogin() {
    const apiUrl = 'http://localhost:5000/api/auth/login';

    this.http.post(apiUrl, this.loginData).subscribe({
      next: (response: any) => {
        console.log("Login Successful:", response);
        localStorage.setItem('token', response.token);
        alert("Welcome Back!");
        this.router.navigate(['/']); 
      },
      error: (err) => {
        console.error("Login Error:", err);
        alert("Invalid Email or Password!");
      }
    });
  }
}