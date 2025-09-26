import { Routes } from '@angular/router';

const authRoutes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.page')
    },

    {
        path: '**',
        redirectTo: 'login'
    }
];

export default authRoutes;
