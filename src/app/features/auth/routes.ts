import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';

export const authRoutes: Routes = [
    {
        path: 'auth',
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: LoginPage
            }
        ]
    }
];
