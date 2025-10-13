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
        // redirectTo: () => {
        //     const authService = inject(AuthService);
        //     return authService.me().pipe(
        //         map((user) => {
        //             console.log('Wildcard route check, user:', user);
        //             if (user) {
        //                 return '/dashboard';
        //             } else {
        //                 return '/auth/login';
        //             }
        //         }),
        //         catchError(() => {
        //             return '/auth/login';
        //         })
        //     );
        // }
        redirectTo: '/dashboard'
    }
];
