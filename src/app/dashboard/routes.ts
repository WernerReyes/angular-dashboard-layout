import { Route } from '@angular/router';

const dashboardRoutes: Route[] = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home.page')
    },
    {
        path: 'menus',
        loadComponent: () => import('./pages/menu/menu.page')
    },
    {
        path: 'pages',
        loadComponent: () => import('./pages/page/pages.page')
    },
    {
        path: 'links',
        loadComponent: () => import('./pages/link/link.page')
    },
    {
        path: 'sections',
        loadComponent: () => import('./pages/section/section.page')
    },

    {
        path: 'categories',
        loadComponent: () => import('./pages/category/category.page')
    },
    {
        path: 'settings',
        loadComponent: () => import('./pages/setting/setting.page')
    },
    {
        path: '**',
        redirectTo: ''
    }
];
export default dashboardRoutes;
