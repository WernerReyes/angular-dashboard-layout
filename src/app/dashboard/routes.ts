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
        path: '**',
        redirectTo: ''
    }
];
export default dashboardRoutes;
