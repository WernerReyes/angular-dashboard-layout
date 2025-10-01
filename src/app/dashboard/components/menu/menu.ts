import { MenuTypes } from '@/dashboard/interfaces/menu';
import { MenuService } from '@/dashboard/services/menu.service';
import { Component, computed, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { Router, RouterLink } from '@angular/router';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'menu',
    imports: [PanelMenuModule, TagModule, ButtonModule, BadgeModule, MessageModule],
    templateUrl: './menu.html',
    styleUrl: './menu.scss'
})
export class Menu {
    private readonly menuService = inject(MenuService);
    private readonly router = inject(Router);
    items: MenuItem[] = [];

    MenuTypes = MenuTypes;

    menuItems = computed<MenuItem[]>(() => {
        return this.menuService.menuList().map((menu) => ({
            label: menu.title,
            icon: 'pi pi-fw pi-file',
            type: menu.type,
            isDroppable: menu.type === MenuTypes.DROPDOWN,
            externalLink: menu.url,
            order: menu.order,
            id: menu.id.toString(),
            items:
                menu.children?.map((child) => ({
                    label: child.title,
                    icon: 'pi pi-fw pi-file',
                    type: child.type,
                    isChild: true,
                    externalLink: child.url,
                    order: child.order
                })) ?? []
        }));
    });

    goToEdit = (menuId: string) => {
        this.menuService.currentMenu.set(null);
        this.router.navigate(['/dashboard/menu/edit', menuId]);
    };

    menuTypeRenderer = (
        type: MenuTypes
    ): {
        label: string;
        severity: string;
    } => {
        switch (type) {
            case MenuTypes.EXTERNAL_LINK:
                return { label: 'Link', severity: 'info' };
            case MenuTypes.DROPDOWN:
                return { label: 'Dropdown', severity: 'success' };
            case MenuTypes.INTERNAL_PAGE:
                return { label: 'Página', severity: 'warn' };
            default:
                return { label: 'Unknown', severity: 'default' };
        }
    };
}
