import { ApplicationConfig } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'; 

import { routes } from './app.routes'; 
import { DialogAlertService } from './services/dialog-alert.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation:'reload'
      })
    ),
    DialogAlertService,
    provideHttpClient(withFetch()) 
  ]
};