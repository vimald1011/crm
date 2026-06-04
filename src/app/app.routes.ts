import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';
import { Login } from './features/auth/login/login';
import { Signup } from './features/auth/signup/signup';
import { DashboardHome } from './features/dashboard/dashboard-home/dashboard-home';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
    {
    path: '',
    component: LandingPage
  },

  {
  path: 'login',
  component: Login,
  canActivate: [guestGuard]
  },

  {
  path: 'signup',
  component: Signup,
  canActivate: [guestGuard]
  },

  {
    path: 'dashboard',
    component: DashboardLayout,

    canActivate: [
    authGuard
  ],


    children: [
      
    {
      path: '',
      component: DashboardHome
    },

    {
      path: 'add-lead',
      loadComponent: () =>
        import('./features/leads/add-lead/add-lead')
          .then(m => m.AddLead)
    },

    {
  path: 'edit-lead/:id',

  loadComponent: () =>
    import('./features/leads/edit-lead/edit-lead')
      .then(m => m.EditLead)
  }
    ]
  }
];
