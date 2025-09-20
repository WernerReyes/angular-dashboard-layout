import { authRoutes } from '@/features/auth/routes';
import { dashboardRoutes } from '@/features/dashboard/routes';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [...authRoutes, ...dashboardRoutes, { path: '**', redirectTo: '/auth/login' }];
