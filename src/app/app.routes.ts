import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { MovieDetailsComponent } from './movie-details/movie-details';
import { BookingComponent } from './booking/booking';
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

export const routes: Routes = [
  // User Routes
  { path: '', component: HomeComponent },
  { path: 'movies', component: MoviesComponent },
  { path: 'movie/:id', component: MovieDetailsComponent },
  { path: 'booking/:id', component: BookingComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'theaters', component: TheatersComponent },
  { path: 'releases', component: ReleasesComponent },

  // --- NEW ADMIN ROUTES ---
  {
    path: 'admin',
    component: AdminLayoutComponent, // The Shell (Sidebar + Content)
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'movies', component: ManageMoviesComponent },
      { path: 'theaters', component: ManageTheatersComponent },
      // Redirect empty 'admin' path to 'dashboard'
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];