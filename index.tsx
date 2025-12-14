
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { AppComponent } from './src/app.component';
import { routes } from './src/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {AuthInterceptor} from './src/core/interceptors/auth.interceptor'

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptors([AuthInterceptor]))
  ]
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
