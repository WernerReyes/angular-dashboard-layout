import { Route } from '@angular/router';

const dashboardRoutes: Route[] = [
    {  
        path: '',
        loadComponent: () => import('./pages/home/home.page')
    },
    {
        path: 'menu',
        loadComponent: () => import('./pages/menu/menu.page')
    },
    {
        path: 'menu/new',
        loadComponent: () => import('./pages/upsert-menu/upsert-menu.page')
    },
    {
        path: '**',
        redirectTo: ''
    }
];
export default dashboardRoutes;
