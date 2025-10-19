import { Routes } from '@angular/router';

export const sectionRoutes: Routes = [
    {
        path: 'layouts',
        loadComponent: () => import('./pages/layout/layout.page')
    },
    {
        path: 'custom',
        loadComponent: () => import('./pages/custom/custom.page')
    },
    {
        path: '**',
        redirectTo: 'custom'
    }
];
