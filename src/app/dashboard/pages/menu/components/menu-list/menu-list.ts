import { MenuService } from '@/dashboard/services/menu.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import { linkTypeOptions } from '@/shared/interfaces/link';
import { menuActiveStatusOptions, type Menu } from '@/shared/interfaces/menu';
import { LinkType } from '@/shared/mappers/link.mapper';
import { MessageService } from '@/shared/services/message.service';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, inject, linkedSignal, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { MenuUtils } from '../../../../utils/menu.utils';
import { MenuFormService } from '../../services/menu-form.service';
import { MenuItem } from './menu-item/menu-item';

type MenuComponent = Menu & {
    expanded?: boolean;
};

@Component({
    selector: 'menu-list',
    imports: [ErrorBoundary, MenuItem, DataViewSkeleton, ConfirmDialogModule, MessageModule, DragDropModule, FormsModule, TagModule, DividerModule, BadgeModule, MenuModule, InputTextModule, InputGroupModule, InputGroupAddonModule, ButtonModule],
    templateUrl: './menu-list.html',
    providers: [ConfirmationService]
})
export class MenuList {
    private readonly confirmationService = inject(ConfirmationService);
    private readonly menuService = inject(MenuService);
    private readonly menuFormService = inject(MenuFormService);
    private readonly messageService = inject(MessageService);

    menuList = this.menuService.menuListResource;

    onDisplay = output<boolean>();
    onSelectedMenu = output<Menu>();

    linkTypeOptions = linkTypeOptions;

    menuActiveStatus = menuActiveStatusOptions;

    LinkType = LinkType;

    searchQuery = signal<string>('');

    
    filteredMenuList = linkedSignal<MenuComponent[]>(() => {
        const term = this.searchQuery().toLowerCase();
        const menus = this.menuList.hasValue() ? this.menuList.value() : [];
        const menuComponents = structuredClone(menus).map((menu) => ({
            ...menu,
            expanded: false
        })) as MenuComponent[];

        if (!term) return menuComponents;

        return menuComponents.filter((menu) => menu.title.toLowerCase().includes(term) || (menu.children && menu.children.some((child) => child.title.toLowerCase().includes(term))));
    });

    targetList = signal<MenuComponent[]>([]);

    hasPositionChanged = signal(false);

    openDialogAndEdit(menu: Menu) {
        this.onDisplay.emit(true);
        this.onSelectedMenu.emit(menu);

        this.menuFormService.populateForm(menu);
    }

   

    
   

  

    confirmDeleteMenu(event: Event, menu: Menu) {
        const message = menu.children && menu.children.length > 0 ? 'Esta acción eliminará el menú seleccionado y todos sus submenús. ¿Deseas continuar?' : 'Estás seguro de que deseas eliminar este menú?';
        this.confirmationService.confirm({
            target: event.target as EventTarget,
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
