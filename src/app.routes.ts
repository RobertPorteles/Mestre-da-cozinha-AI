import { Routes } from '@angular/router';
import { AuthGuard} from './core/auth/auth.guard'

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./core/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./core/components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./core/components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'login-success',
    loadComponent: () => import('./core/components/login-success/login-success').then(m => m.LoginSuccess)
  },
  {
    path: 'planos',
    loadComponent: () => import('./core/components/planos-component/planos-component').then(m => m.PlanosComponent),
    canActivate: [AuthGuard]
  },
  {
    path:'',
    pathMatch:'full',
    redirectTo:'login'
  }
];