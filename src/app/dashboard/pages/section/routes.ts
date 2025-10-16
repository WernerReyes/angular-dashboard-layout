import { Routes } from '@angular/router';

export const sectionRoutes: Routes = [
    {
        path: 'layouts',
        loadComponent: () => import('./pages/layout/layout.page')
    },
    {
        path: 'personalized',
        loadComponent: () => import('./pages/personalized/personalized.page')
    },
    {
        path: '**',
        redirectTo: 'personalized'
    }
];
