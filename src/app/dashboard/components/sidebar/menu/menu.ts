import { Component } from '@angular/core';
import { type MenuItem as IMenuItem } from 'primeng/api';
import { MenuItem } from './menu-item/menu-item';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'dashboard-menu',
    imports: [MenuItem, RouterModule],
    templateUrl: './menu.html',
    styleUrl: './menu.scss'
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
                        label: 'Menu',
                        icon: 'pi pi-fw pi-bars',
                        routerLink: ['/dashboard/menu']
                    },
                    {
                        label: 'Pages',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/dashboard/pages']
                    },
                    {
                        label: 'Links',
                        icon: 'pi pi-fw pi-link',
                        routerLink: ['/dashboard/links']
                    }
                ]
            }
        ];
    }
}
