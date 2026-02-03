import { Component, inject } from '@angular/core'; // <--- Import inject
import { Router, RouterModule } from '@angular/router'; // <--- Import Router

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule], 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  
  // 1. Get access to the Router
  private router = inject(Router);

  // 2. Create a function to handle the click
  onLogin() {
    // (Here you would normally check email/password)
    console.log("Login Successful");
    
    // 3. Navigate to Home Page
    this.router.navigate(['/']); 
  }
}