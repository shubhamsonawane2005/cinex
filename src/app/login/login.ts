
// import { Component, inject } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms'; 
// import { HttpClient, HttpClientModule } from '@angular/common/http'; 

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [RouterModule, FormsModule, HttpClientModule], 
//   templateUrl: './login.html',
//   styleUrl: './login.css'
// })
// export class LoginComponent {
  
//   private router = inject(Router);
//   private http = inject(HttpClient);

//   loginData = {
//     email: '',
//     password: ''
//   };

//   onLogin() {
//     const apiUrl = 'http://localhost:5000/api/auth/login';

//     this.http.post(apiUrl, this.loginData).subscribe({
//       next: (response: any) => {
//         console.log("Login Successful:", response);
//         localStorage.setItem('token', response.token);
//         alert("Welcome Back!");
//         this.router.navigate(['/']); 
//       },
//       error: (err) => {
//         console.error("Login Error:", err);
//         alert("Invalid Email or Password!");
//       }
//     });
//   }
// }

// import { Component, inject } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms'; 
// import { HttpClient, HttpClientModule } from '@angular/common/http'; 

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [RouterModule, FormsModule, HttpClientModule], 
//   templateUrl: './login.html',
//   styleUrl: './login.css'
// })
// export class LoginComponent {
  
//   private router = inject(Router);
//   private http = inject(HttpClient);

//   loginData = {
//     email: '',
//     password: ''
//   };

//   onLogin() {
//     // --- ADMIN CHECK START ---
//     if (this.loginData.email === 'admin@gmail.com' && this.loginData.password === 'admin123') {
//       localStorage.setItem('token', 'admin-secret-token'); // Dummy token for admin
//       localStorage.setItem('role', 'admin'); 
//       alert("Welcome Admin!");
//       this.router.navigate(['/admin-dashboard']); // Yahan apne admin page ka path check kar lena
//       return; // Aage ka code nahi chalega
//     }
//     // --- ADMIN CHECK END ---

//     const apiUrl = 'http://localhost:5000/api/auth/login';

//     this.http.post(apiUrl, this.loginData).subscribe({
//       next: (response: any) => {
//         console.log("Login Successful:", response);
//         localStorage.setItem('token', response.token);
//         localStorage.setItem('role', 'user'); // Normal user ke liye
//         alert("Welcome Back!");
//         this.router.navigate(['/']); 
//       },
//       error: (err) => {
//         console.error("Login Error:", err);
//         alert("Invalid Email or Password!");
//       }
//     });
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
    // --- ADMIN CHECK START ---
    if (this.loginData.email === 'admin@gmail.com' && this.loginData.password === 'admin123') {
      localStorage.setItem('token', 'admin-secret-token'); // Dummy token for admin
      localStorage.setItem('role', 'admin'); 
      alert("Welcome Admin!");
      this.router.navigate(['/']); // OK dabane par seedha Home page pe jayega
      return; // Aage ka code nahi chalega
    }
    // --- ADMIN CHECK END ---

    const apiUrl = 'http://localhost:5000/api/auth/login';

    this.http.post(apiUrl, this.loginData).subscribe({
      next: (response: any) => {
        console.log("Login Successful:", response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', 'user'); // Normal user ke liye
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