
// import { Component, inject, ChangeDetectorRef } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms'; 
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http'; 
// import { AuthService } from '../services/auth.service';

// @Component({
//   selector: 'app-signup',
//   standalone: true,
//   imports: [RouterModule, FormsModule, CommonModule],
//   templateUrl: './signup.html',
//   styleUrl: './signup.css' 
// })
// export class SignupComponent {
//   private router = inject(Router);
//   private authService = inject(AuthService);
//   private http = inject(HttpClient); 
//   private cdr = inject(ChangeDetectorRef); 

//   signupData = {
//     username: '',
//     email: '',
//     mobile: '',
//     password: ''
//   };

//   otpSent: boolean = false;
//   userEnteredOtp: string = '';
//   serverGeneratedOtp: any = null;

//   sendOtp() {
//     // 1. Validation
//     if (!this.signupData.username || !this.signupData.email || !this.signupData.mobile || !this.signupData.password) {
//       alert("Please fill in all details.");
//       return;
//     }

//     // 2. Call Backend API
//     this.http.post('http://localhost:5000/api/send-otp', { email: this.signupData.email })
//       .subscribe({
//         next: (res: any) => {
//           // A. Sabse pehle backend se aaya OTP save karo
//           this.serverGeneratedOtp = res.otp; 

//           // B. Alert dikhao
//           alert("OTP sent successfully! Please check your email.");

//           // C. OK DABATE HI: Ye do line screen change kar dengi
//           setTimeout(() => {
//             this.otpSent = true; 
//             this.cdr.detectChanges(); // Forcefully screen update
//           }, 0);

//           console.log("OK clicked, Section switched to OTP input.");
//         },
//         error: (err) => {
//           console.error(err);
//           alert("Error sending OTP. Please check if your backend is running.");
//         }
//       });
//   }

//   verifyAndSignup() {
//     if (!this.userEnteredOtp) {
//       alert("Please enter the OTP.");
//       return;
//     }

//     // Comparing strictly as strings
//     if (this.userEnteredOtp.toString().trim() === this.serverGeneratedOtp?.toString().trim()) {
//       alert("OTP Verified!");
//       this.completeSignup();
//     } else {
//       alert("Invalid OTP. Please check again.");
//     }
//   }

//   private completeSignup() {
//     this.authService.signup(this.signupData).subscribe({
//       next: (res) => {
//         alert("Account Created Successfully!");
//         this.router.navigate(['/login']); 
//       },
//       error: (err) => {
//         alert(err.error?.message || "Signup failed.");
//       }
//     });
//   }
// }

// import { Component, inject, ChangeDetectorRef } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms'; 
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http'; 
// import { AuthService } from '../services/auth.service';

// @Component({
//   selector: 'app-signup',
//   standalone: true,
//   imports: [RouterModule, FormsModule, CommonModule],
//   templateUrl: './signup.html',
//   styleUrl: './signup.css' 
// })
// export class SignupComponent {
//   private router = inject(Router);
//   private authService = inject(AuthService);
//   private http = inject(HttpClient); 
//   private cdr = inject(ChangeDetectorRef); 

//   signupData = {
//     username: '',
//     email: '',
//     mobile: '',
//     password: ''
//   };

//   otpSent: boolean = false;
//   userEnteredOtp: string = '';
//   serverGeneratedOtp: any = null;

//   sendOtp() {
//     if (!this.signupData.username || !this.signupData.email || !this.signupData.mobile || !this.signupData.password) {
//       alert("Please fill in all details.");
//       return;
//     }

//     this.http.post('http://localhost:5000/api/send-otp', { email: this.signupData.email })
//       .subscribe({
//         next: (res: any) => {
//           this.serverGeneratedOtp = res.otp; 

//           alert("OTP sent successfully! Please check your email.");

//           setTimeout(() => {
//             this.otpSent = true; 
//             this.cdr.detectChanges(); 
//           }, 0);

//           console.log("OK clicked, Section switched to OTP input.");
//         },
//         error: (err) => {
//           console.error(err);
//           alert("Error sending OTP. Please check if your backend is running.");
//         }
//       });
//   }

//   verifyAndSignup() {
//     if (!this.userEnteredOtp) {
//       alert("Please enter the OTP.");
//       return;
//     }

//     if (this.userEnteredOtp.toString().trim() === this.serverGeneratedOtp?.toString().trim()) {
//       alert("OTP Verified!");
//       this.completeSignup();
//     } else {
//       alert("Invalid OTP. Please check again.");
//     }
//   }

//   private completeSignup() {
//     this.authService.signup(this.signupData).subscribe({
//       next: (res: any) => {
//         // --- YE LINE ADD KI HAI SECURITY KE LIYE ---
//         if (res.token) {
//           localStorage.setItem('token', res.token); 
//         }
//         // -------------------------------------------

//         alert("Account Created Successfully!");
//         // Ab hum login ki jagah seedha booking ya home pe bhej sakte hain
//         this.router.navigate(['/']); 
//       },
//       error: (err) => {
//         alert(err.error?.message || "Signup failed.");
//       }
//     });
//   }
// }

import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; 
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css' 
})
export class SignupComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private http = inject(HttpClient); 
  private cdr = inject(ChangeDetectorRef); 

  signupData = {
    username: '',
    email: '',
    mobile: '',
    password: ''
  };

  otpSent: boolean = false;
  userEnteredOtp: string = '';
  serverGeneratedOtp: any = null;

  sendOtp() {
    // 1. Basic Empty Check
    if (!this.signupData.username || !this.signupData.email || !this.signupData.mobile || !this.signupData.password) {
      alert("Please fill in all details.");
      return;
    }

    // --- PROPER VALIDATION ADDED HERE ---
    const mobileStr = this.signupData.mobile.toString();
    if (mobileStr.length !== 10) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }
    // ------------------------------------

    this.http.post('http://localhost:5000/api/send-otp', { email: this.signupData.email })
      .subscribe({
        next: (res: any) => {
          this.serverGeneratedOtp = res.otp; 

          alert("OTP sent successfully! Please check your email.");

          setTimeout(() => {
            this.otpSent = true; 
            this.cdr.detectChanges(); 
          }, 0);

          console.log("OK clicked, Section switched to OTP input.");
        },
        error: (err) => {
          console.error(err);
          alert("Error sending OTP. Please check if your backend is running.");
        }
      });
  }

  verifyAndSignup() {
    if (!this.userEnteredOtp) {
      alert("Please enter the OTP.");
      return;
    }

    if (this.userEnteredOtp.toString().trim() === this.serverGeneratedOtp?.toString().trim()) {
      alert("OTP Verified!");
      this.completeSignup();
    } else {
      alert("Invalid OTP. Please check again.");
    }
  }

  private completeSignup() {
    this.authService.signup(this.signupData).subscribe({
      next: (res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token); 
        }

        alert("Account Created Successfully!");
        this.router.navigate(['/']); 
      },
      error: (err) => {
        alert(err.error?.message || "Signup failed.");
      }
    });
  }
}