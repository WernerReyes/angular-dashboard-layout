import { MenuTypes } from '@/dashboard/interfaces/menu';
import { MenuFormService } from '@/dashboard/services/menu-form.service';
import { MenuService } from '@/dashboard/services/menu.service';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
@Component({
    selector: 'menu',
    imports: [PanelMenuModule, TagModule, ButtonModule, BadgeModule, MessageModule, ToastModule, ConfirmDialogModule],
    templateUrl: './menu.html',
    styleUrl: './menu.scss',
    providers: [MessageService, ConfirmationService]
})
export class Menu {
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);
    private readonly menuService = inject(MenuService);
    private readonly menuFormService = inject(MenuFormService);
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

    confirm2(event: Event, item: MenuItem) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Estás seguro de que deseas eliminar el menú "${item.label}"? Esta acción no se puede deshacer.`,
            header: 'Danger Zone',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Delete',
                severity: 'danger'
            },

            accept: () => {
                this.menuService.deleteMenu(Number(item.id), item['type']).subscribe({
                    next: ({ message }) => {
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: message });
                        // Si el menú eliminado es el que está cargado en el formulario, resetear el formulario
                        if (this.menuService.currentMenu()?.id === Number(item.id)) {
                            this.menuFormService.form.reset();
                            this.menuFormService.form.clearValidators();
                            this.menuFormService.form.updateValueAndValidity();
                            this.menuFormService.dropdownItems.clear();
                            this.menuService.currentMenu.set(null);
                            this.menuFormService.selectedMenuType.set(undefined);
                        }
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'Error al eliminar el menú' });
                    }
                });

                // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
            }
        });
    }

    goToEdit = (menuId: string) => {
        this.menuService.currentMenu.set(null);
        this.menuFormService.dropdownItems.clear();
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
