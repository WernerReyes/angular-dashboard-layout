import { Route } from '@angular/router';

const dashboardRoutes: Route[] = [
    {  
        path: '',
        loadComponent: () => import('./pages/home/home.page')
    },
    {
        path: 'menu',
        loadComponent: () => import('./pages/menu/menu.page'),
    },
    {
        path: 'menu/new',
        loadComponent: () => import('./pages/create-menu/create-menu.page')
    },
    {
        path: 'menu/edit/:id',
        loadComponent: () => import('./pages/update-menu/update-menu.page')
    },

    {
        path: 'pages',
        loadComponent: () => import('./pages/page/pages.page')
    },
    {
        path: 'pages/new',
        loadComponent: () => import('./pages/create-page/create-page.page')
    },
    {
        path: 'links',
        loadComponent: () => import('./pages/link/link.page')
    },
    {
        path: '**',
        redirectTo: ''
    }
];
export default dashboardRoutes;
