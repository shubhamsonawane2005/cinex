import { inject , PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Agar token hi nahi hai
    if (!token) {
      alert("Please login first!");
      router.navigate(['/login']);
      return false;
    }
    if (state.url.startsWith('/admin') && role !== 'admin') {
      alert("Access Denied! You are not an Admin.");
      router.navigate(['/']); // Home pe bhej do
      return false;
    }

    return true; 
  }
  return true;
};