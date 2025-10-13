import { authGuard } from '@/auth/guards/auth-guard';
import { notAuthenticatedGuard } from '@/auth/guards/not-authenticated-guard';
import { AuthService } from '@/auth/services/auth.service';
import { DashboardLayout } from '@/dashboard/layout/layout';
import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { catchError, map } from 'rxjs';

export const appRoutes: Routes = [
    {
        canMatch: [notAuthenticatedGuard],
        path: 'auth',
        loadChildren: () => import('./app/auth/routes')
    },
    {
        path: 'dashboard',

        canMatch: [authGuard],
        component: DashboardLayout,
        loadChildren: () => import('./app/dashboard/routes')
    },

    {
        path: '**',
        redirectTo: '/dashboard'
    }
];
