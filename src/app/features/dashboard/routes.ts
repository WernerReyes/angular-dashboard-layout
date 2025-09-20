import { Routes } from '@angular/router';
import { DashboardLayout } from './layout/layout';
import { HomePage } from './pages/home/home.page';

export const dashboardRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardLayout,
        children: [
            {
                path: '',
                component: HomePage
            }
        ]
    }
];
