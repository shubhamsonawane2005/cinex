
import { Routes } from '@angular/router';
import { authGuard } from './auth.guard'; 
import { HomeComponent } from './home/home';
import { MovieDetailsComponent } from './movie-details/movie-details';
import { PaymentComponent } from './payment/payment';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';
import { MoviesComponent } from './movies/movies';
import { TheatersComponent } from './theaters/theaters';
import { ReleasesComponent } from './releases/releases';

import { ProfileComponent } from './profile/profile.component'; // Profile component import kiya

// --- IMPORT ADMIN COMPONENTS ---
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout';
import { DashboardComponent } from './admin/dashboard/dashboard';
import { ManageMoviesComponent } from './admin/manage-movies/manage-movies';
import { ManageTheatersComponent } from './admin/manage-theaters/manage-theaters';
import { UserListComponent } from './admin/user-list/user-list';

export const routes: Routes = [
  // User Routes
  { path: '', component: HomeComponent },
  { path: 'movies', component: MoviesComponent },
  
  // 1. PEHLE YE KAREGA (Date/Time selection isi page par aayegi)
  { path: 'movie/:id', component: MovieDetailsComponent }, 

  // 2. PHIR YE KAREGA (Jab user 'Book Now' dabayega)
  { 
    path: 'booking/:movieId/:theaterId/:time', 
    loadComponent: () => import('./booking/booking').then(m => m.BookingComponent),
    canActivate: [authGuard] 
  },

  { path: 'payment', component: PaymentComponent, canActivate: [authGuard] },
  
  // --- YE WALI LINE ADD KI HAI (Profile page khulne ke liye) ---
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'theaters', component: TheatersComponent },
  { path: 'releases', component: ReleasesComponent },

  // --- ADMIN ROUTES ---
  {
    path: 'admin',
    component: AdminLayoutComponent, 
    canActivate: [authGuard], 
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'movies', component: ManageMoviesComponent },
      { path: 'theaters', component: ManageTheatersComponent },
      { path: 'users', component: UserListComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];