import { authGuard } from '@/auth/guards/auth-guard';
import { AuthService } from '@/auth/services/auth.service';
import { DashboardLayout } from '@/dashboard/layout/layout';
import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { catchError, map } from 'rxjs';

export const appRoutes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./app/auth/routes')
    },
    {
        canActivate: [authGuard],
        path: 'dashboard',
        component: DashboardLayout,
        loadChildren: () => import('./app/dashboard/routes')
    },

    {
        path: '**',
        redirectTo: () => {
            const authService = inject(AuthService);
            return authService.me().pipe(
                map((user) => {
                    if (user) {
                        return '/dashboard';
                    } else {
                        return '/auth/login';
                    }
                }),
                catchError(() => {
                    return '/auth/login';
                })
            );
        }
    }
];
