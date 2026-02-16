import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // ✅ Login hai toh jane do
  } else {
    alert("You need to Login or Signup to access this page"); 
    router.navigate(['/login']); // ❌ Wapas Login pe bhej do
    return false;
  }
};