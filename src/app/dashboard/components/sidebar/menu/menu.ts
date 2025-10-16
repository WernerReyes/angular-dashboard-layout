import { Component } from '@angular/core';
import { type MenuItem as IMenuItem } from 'primeng/api';
import { MenuItem } from './menu-item/menu-item';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'dashboard-menu',
    imports: [MenuItem, RouterModule],
    templateUrl: './menu.html'
})
export class Menu {
    model: IMenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                // label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
                    {
                        label: 'Menus',
                        icon: 'pi pi-fw pi-bars',
                        routerLink: ['/dashboard/menus']
                    },
                    {
                        label: 'Pages',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/dashboard/pages']
                    },
                    {
                        label: 'Enlaces',
                        icon: 'pi pi-fw pi-link',
                        routerLink: ['/dashboard/links']
                    },
                    {
                        label: 'Secciones',
                        icon: 'pi pi-th-large',
                        // routerLink: ['/dashboard/sections'],
                        items: [
                            { label: 'Layouts', icon: 'pi pi-th-large', routerLink: ['/dashboard/sections/layouts'] },
                            { label: 'Personalizadas', icon: 'pi pi-cog', routerLink: ['/dashboard/sections/personalized'] }
                        ]
                    },
                    {
                        label: 'Categorías',
                        icon: 'pi pi-tags',
                        routerLink: ['/dashboard/categories']
                    }
                ]
            }
        ];
    }
}
