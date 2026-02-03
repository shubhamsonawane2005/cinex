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

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movies', component: MoviesComponent },
  { path: 'movie/:id', component: MovieDetailsComponent },
  { path: 'booking/:id', component: BookingComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'theaters', component: TheatersComponent },
  { path: 'releases', component: ReleasesComponent }
];