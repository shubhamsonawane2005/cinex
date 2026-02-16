

// import { Component, inject } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms'; 
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../services/auth.service'; // Path sahi check kar lena

// @Component({
//   selector: 'app-signup',
//   standalone: true,
//   imports: [RouterModule, FormsModule, CommonModule],
//   templateUrl: './signup.html',
//   styleUrl: './signup.css' 
// })
// export class SignupComponent {
//   private router = inject(Router);
//   private authService = inject(AuthService); // Service use kar rahe hain

//   signupData = {
//     username: '',
//     email: '',
//     mobile: '',
//     password: ''
//   };

//   onSignup() {
// // Validation: Simple check to ensure mobile is provided
//     if (!this.signupData.mobile || this.signupData.mobile.length !== 10) {
//       alert("Please enter a valid 10-digit mobile number.");
//       return;
//     }
//     // Service ko call kar rahe hain
//     this.authService.signup(this.signupData).subscribe({
//       next: (res) => {
//         console.log("Signup success!", res);
//         alert("Account Created Successfully!");
//         this.router.navigate(['/login']); 
//       },
//       error: (err) => {
//         console.error("Signup error", err);
//         // Agar backend se message aata hai toh wo dikhayega
//         alert(err.error?.message || "Signup failed. Try again.");
//       }
//     });
//   }
// }
// import { Component, inject } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms'; 
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http'; // HttpClient add kiya
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
//   private http = inject(HttpClient); // Inject kiya

//   signupData = {
//     username: '',
//     email: '',
//     mobile: '',
//     password: ''
//   };

//   // OTP ke liye naye variables
//   otpSent: boolean = false;
//   userEnteredOtp: string = '';
//   serverGeneratedOtp: any = null;

//   // 1. Sabse pehle OTP bhejne ka kaam
//   sendOtp() {
//     if (!this.signupData.email) {
//       alert("Bhai, pehle Email toh daal!");
//       return;
//     }

//     this.http.post('http://localhost:5000/api/send-otp', { email: this.signupData.email })
//       .subscribe({
//         next: (res: any) => {
//           if (res.success) {
//             this.otpSent = true;
//             this.serverGeneratedOtp = res.otp;
//             alert("OTP bhej diya hai! Gmail check kar.");
//           }
//         },
//         error: (err) => alert("OTP bhejne mein galti hui!")
//       });
//   }

//   // 2. OTP Verify karke Final Signup karna
//   verifyAndSignup() {
//     if (this.userEnteredOtp == this.serverGeneratedOtp) {
//       // Agar OTP sahi hai, toh purana signup logic chalao
//       this.completeSignup();
//     } else {
//       alert("Galat OTP hai bhai!");
//     }
//   }

//   // 3. Tera purana signup logic jo database mein data bhejega
//   private completeSignup() {
//     if (!this.signupData.mobile || this.signupData.mobile.length !== 10) {
//       alert("Please enter a valid 10-digit mobile number.");
//       return;
//     }

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
// import { Component, inject } from '@angular/core';
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

//   signupData = {
//     username: '',
//     email: '',
//     mobile: '',
//     password: ''
//   };

//   otpSent: boolean = false;
//   userEnteredOtp: string = '';
//   serverGeneratedOtp: any = null;

//   // 1. Send OTP with Validation
//   sendOtp() {
//     const data = this.signupData;

//     // Validation checks
//     if (!data.username || !data.email || !data.mobile || !data.password) {
//       alert("Please fill in all details.");
//       return;
//     }

//     const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
//     if (!emailPattern.test(data.email)) {
//       alert("Please enter a valid email address.");
//       return;
//     }

//     if (data.mobile.toString().length !== 10) {
//       alert("Mobile number must be exactly 10 digits.");
//       return;
//     }

//     if (data.password.length < 6) {
//       alert("Password must be at least 6 characters long.");
//       return;
//     }

//     // API Call to send OTP
//     this.http.post('http://localhost:5000/api/send-otp', { email: data.email })
//       .subscribe({
//         next: (res: any) => {
//           // Check if server response is successful
//           if (res) {
//             this.serverGeneratedOtp = res.otp; 
//             console.log("Server OTP saved:", this.serverGeneratedOtp);
            
//             // First show alert, then switch the view
//             alert("OTP sent successfully! Please check your email.");
//             this.otpSent = true; // This will show the OTP input section
//           }
//         },
//         error: (err) => {
//           console.error(err);
//           alert("Error sending OTP. Please try again later.");
//         }
//       });
//   }

//   // 2. Verify OTP
//   verifyAndSignup() {
//     if (!this.userEnteredOtp) {
//       alert("Please enter the OTP.");
//       return;
//     }

//     // Compare entered OTP with server OTP (Trimmed to remove spaces)
//     if (this.userEnteredOtp.toString().trim() === this.serverGeneratedOtp?.toString().trim()) {
//       alert("OTP verified! Creating your account...");
//       this.completeSignup();
//     } else {
//       alert("Invalid OTP. Please check and try again.");
//     }
//   }

//   // 3. Final Signup logic
//   private completeSignup() {
//     this.authService.signup(this.signupData).subscribe({
//       next: (res) => {
//         alert("Account Created Successfully!");
//         this.router.navigate(['/login']); 
//       },
//       error: (err) => {
//         alert(err.error?.message || "Signup failed. Email might already be registered.");
//       }
//     });
//   }
// }
// import { Component, inject } from '@angular/core';
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
//     const data = this.signupData;

//     if (!data.username || !data.email || !data.mobile || !data.password) {
//       alert("Please fill in all details.");
//       return;
//     }

//     if (data.mobile.toString().length !== 10) {
//       alert("Mobile number must be exactly 10 digits.");
//       return;
//     }

//     this.http.post('http://localhost:5000/api/send-otp', { email: data.email })
//       .subscribe({
//         next: (res: any) => {
//           // 1. Sabse pehle OTP save karo
//           this.serverGeneratedOtp = res.otp; 
          
//           // 2. Alert se PEHLE section switch karo
//           this.otpSent = true; 

//           // 3. Ab alert dikhao. OK dabate hi screen badli hui milegi
//           setTimeout(() => {
//             alert("OTP sent successfully! Please check your email.");
//           }, 100);
//         },
//         error: (err) => {
//           console.error(err);
//           alert("Error sending OTP. Please try again later.");
//         }
//       });
//   }

//   verifyAndSignup() {
//     if (!this.userEnteredOtp) {
//       alert("Please enter the OTP.");
//       return;
//     }

//     if (this.userEnteredOtp.toString().trim() === this.serverGeneratedOtp?.toString().trim()) {
//       this.completeSignup();
//     } else {
//       alert("Invalid OTP. Please check and try again.");
//     }
//   }

//   private completeSignup() {
//     this.authService.signup(this.signupData).subscribe({
//       next: (res) => {
//         alert("Account Created Successfully!");
//         this.router.navigate(['/login']); 
//       },
//       error: (err) => {
//         alert(err.error?.message || "Signup failed. Email might already be registered.");
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
    // 1. Validation
    if (!this.signupData.username || !this.signupData.email || !this.signupData.mobile || !this.signupData.password) {
      alert("Please fill in all details.");
      return;
    }

    // 2. Call Backend API
    this.http.post('http://localhost:5000/api/send-otp', { email: this.signupData.email })
      .subscribe({
        next: (res: any) => {
          // A. Sabse pehle backend se aaya OTP save karo
          this.serverGeneratedOtp = res.otp; 

          // B. Alert dikhao
          alert("OTP sent successfully! Please check your email.");

          // C. OK DABATE HI: Ye do line screen change kar dengi
          setTimeout(() => {
            this.otpSent = true; 
            this.cdr.detectChanges(); // Forcefully screen update
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

    // Comparing strictly as strings
    if (this.userEnteredOtp.toString().trim() === this.serverGeneratedOtp?.toString().trim()) {
      alert("OTP Verified!");
      this.completeSignup();
    } else {
      alert("Invalid OTP. Please check again.");
    }
  }

  private completeSignup() {
    this.authService.signup(this.signupData).subscribe({
      next: (res) => {
        alert("Account Created Successfully!");
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        alert(err.error?.message || "Signup failed.");
      }
    });
  }
}