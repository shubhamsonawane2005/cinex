// import { Routes } from '@angular/router';
// import { HomeComponent } from './home/home';
// import { MovieDetailsComponent } from './movie-details/movie-details';
// import { BookingComponent } from './booking/booking';
// import { PaymentComponent } from './payment/payment';
// import { LoginComponent } from './login/login';
// import { SignupComponent } from './signup/signup';
// import { MoviesComponent } from './movies/movies';
// import { TheatersComponent } from './theaters/theaters';
// import { ReleasesComponent } from './releases/releases';

// // --- IMPORT ADMIN COMPONENTS ---
// import { AdminLayoutComponent } from './admin/admin-layout/admin-layout';
// import { DashboardComponent } from './admin/dashboard/dashboard';
// import { ManageMoviesComponent } from './admin/manage-movies/manage-movies';
// import { ManageTheatersComponent } from './admin/manage-theaters/manage-theaters';
// import { UserListComponent } from './admin/user-list/user-list';

// export const routes: Routes = [
//   // User Routes
//   { path: '', component: HomeComponent },
//   { path: 'movies', component: MoviesComponent },
//   { path: 'movie/:id', component: MovieDetailsComponent },
// { 
//     path: 'booking/:movieId/:theaterId/:time', 
//     loadComponent: () => import('./booking/booking').then(m => m.BookingComponent) 
//   },
//   { path: 'payment', component: PaymentComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'signup', component: SignupComponent },
//   { path: 'theaters', component: TheatersComponent },
//   { path: 'releases', component: ReleasesComponent },

//   // --- ADMIN ROUTES ---
//   {
//     path: 'admin',
//     component: AdminLayoutComponent, // The Shell (Sidebar + Content)
//     children: [
//       { path: 'dashboard', component: DashboardComponent },
//       { path: 'movies', component: ManageMoviesComponent },
//       { path: 'theaters', component: ManageTheatersComponent },
//       { path: 'users', component: UserListComponent },
//       // Redirect empty 'admin' path to 'dashboard'
//       { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
//     ]
//   }
// ];
import { Routes } from '@angular/router';
import { authGuard } from './auth.guard'; 
import { HomeComponent } from './home/home';
import { MovieDetailsComponent } from './movie-details/movie-details';
// BookingComponent upar se hata diya kyunki niche loadComponent use ho raha hai
import { PaymentComponent } from './payment/payment';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';
import { MoviesComponent } from './movies/movies';
import { TheatersComponent } from './theaters/theaters';
import { ReleasesComponent } from './releases/releases';

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
  { path: 'movie/:id', component: MovieDetailsComponent },
  
  // 1. Booking pe security lagayi (Lazy Loading ke saath)
  { 
    path: 'booking/:movieId/:theaterId/:time', 
    loadComponent: () => import('./booking/booking').then(m => m.BookingComponent),
    canActivate: [authGuard] 
  },

  // 2. Payment pe security lagayi
  { path: 'payment', component: PaymentComponent, canActivate: [authGuard] },
  
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