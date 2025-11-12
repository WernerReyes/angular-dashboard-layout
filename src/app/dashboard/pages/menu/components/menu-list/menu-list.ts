import { MenuService } from '@/dashboard/services/menu.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import { linkTypeOptions } from '@/shared/interfaces/link';
import { type Menu } from '@/shared/interfaces/menu';
import { LinkType } from '@/shared/mappers/link.mapper';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject, linkedSignal, output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { MenuItemCommandEvent, MenuItem as PrimeMenuItem } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { MenuFormService } from '../../services/menu-form.service';
import { MenuItem } from './menu-item/menu-item';

type MenuComponent = Menu & {
    expanded?: boolean;
};

@Component({
    selector: 'menu-list',
    imports: [
        ErrorBoundary,
        ContextMenuModule,
        MenuItem,
        DataViewSkeleton,
        ConfirmDialogModule,
        MessageModule,
        DragDropModule,
        FormsModule,
        TagModule,
        DividerModule,
        BadgeModule,
        MenuModule,
        InputTextModule,
        InputGroupModule,
        InputGroupAddonModule,
        ButtonModule
    ],
    templateUrl: './menu-list.html',
    providers: [ConfirmationService]
})
export class MenuList {
    private readonly confirmationService = inject(ConfirmationService);
    private readonly menuService = inject(MenuService);
    private readonly menuFormService = inject(MenuFormService);

    menuList = this.menuService.menuListResource;
    linkTypeOptions = linkTypeOptions;
    LinkType = LinkType;

    onDisplay = output<boolean>();
    onSelectedMenu = output<Menu>();

    @ViewChild('cm') contextMenu!: ContextMenu;

    searchQuery = signal<string>('');

    currentMenu = signal<Menu | null>(null);

    cmItems: PrimeMenuItem[] = [
        {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () => {
                const menu = this.currentMenu();
                if (menu) {
                    this.openDialogAndEdit(menu);
                }
            }
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            command: (e) => {
                const menu = this.currentMenu();
                if (menu) {
                    this.confirmDeleteMenu(e, menu);
                }
            }
        }
    ];

    filteredMenuList = linkedSignal<MenuComponent[]>(() => {
        const term = this.searchQuery().toLowerCase();
        const menus = this.menuList.hasValue() ? this.menuList.value() : [];
        const menuComponents = structuredClone(menus).map((menu) => ({
            ...menu,
            expanded: false
        })) as MenuComponent[];

        if (!term) return menuComponents;

        return menuComponents.filter(
            (menu) =>
                menu.title.toLowerCase().includes(term) ||
                (menu.children && menu.children.some((child) => child.title.toLowerCase().includes(term))) ||
                menu.children!.some((child) => child.children && child.children.some((grandChild) => grandChild.title.toLowerCase().includes(term)))
        );
    });

    onContextMenu(event: any, menu: Menu) {
        this.contextMenu.show(event);
        this.currentMenu.set(menu);
        this.contextMenu.target = event.currentTarget;
        event.stopPropagation();
        event.preventDefault();
    }

    openDialogAndEdit(menu: Menu) {
        this.onDisplay.emit(true);
        this.onSelectedMenu.emit(menu);

        this.menuFormService.populateForm(menu);
    }

    confirmDeleteMenu(event: MenuItemCommandEvent, menu: Menu) {
        const message = menu.children && menu.children.length > 0 ? 'Esta acción eliminará el menú seleccionado y todos sus submenús. ¿Deseas continuar?' : 'Estás seguro de que deseas eliminar este menú?';
        this.confirmationService.confirm({
            target: event.originalEvent?.target!,
            message,
            header: 'Eliminar categoría',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Eliminar'
            },
            accept: () => {
                this.menuService.deleteMenu(menu.id, menu.parentId).subscribe({
                    next: () => {
                        this.confirmationService.close();
                    },
                    error: () => {
                        this.confirmationService.close();
                    }
                });
            },
            reject: () => {
                this.confirmationService.close();
            }
        });
    }
}
