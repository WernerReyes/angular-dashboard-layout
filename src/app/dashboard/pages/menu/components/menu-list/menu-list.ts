import { MenuService } from '@/dashboard/services/menu.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import { linkTypeOptions } from '@/shared/interfaces/link';
import { menuActiveStatusOptions, type Menu } from '@/shared/interfaces/menu';
import { LinkType } from '@/shared/mappers/link.mapper';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, computed, inject, linkedSignal, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MenuUtils } from '../../../../utils/menu.utils';
import { MenuFormService } from '../../services/menu-form.service';
import { ConfirmOrderChanges } from './confirm-order-changes/confirm-order-changes';
import { DividerModule } from 'primeng/divider';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';

type MenuComponent = Menu & {
    expanded?: boolean;
};

@Component({
    selector: 'menu-list',
    imports: [ConfirmOrderChanges, ErrorBoundary, DataViewSkeleton, ConfirmDialogModule,  DragDropModule, FormsModule,  TagModule, DividerModule, BadgeModule, MenuModule, InputTextModule, InputGroupModule, InputGroupAddonModule, ButtonModule],
    templateUrl: './menu-list.html',
    providers: [ConfirmationService]
})
export class MenuList {
    private readonly menuService = inject(MenuService);
    private readonly menuFormService = inject(MenuFormService);

    menuList = this.menuService.menuListResource;

    onDisplay = output<boolean>();
    onSelectedMenu = output<Menu>();

    linkTypeOptions = linkTypeOptions;

    menuActiveStatus = menuActiveStatusOptions;

    LinkType = LinkType;

    searchQuery = signal<string>('');


    originMenuList = computed<MenuComponent[]>(() => {
        const menus = this.menuList.hasValue() ? this.menuList.value() : [];
        return structuredClone(menus).map((menu) => ({ ...menu, expanded: false })) as MenuComponent[];
    });

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

    hasChanges = signal(false);

    lastChangeTime = signal<number | null>(null);

    openDialogAndEdit(menu: Menu) {
        this.onDisplay.emit(true);
        this.onSelectedMenu.emit(menu);

        this.menuFormService.populateForm(menu);
    }

    

    drop(event: CdkDragDrop<Menu[]>, targetList: Menu[], parentList?: Menu[]) {
        // Si se reordenó dentro del mismo contenedor
        if (event.previousContainer === event.container) {
            moveItemInArray(targetList, event.previousIndex, event.currentIndex);
        } else {
            // Si se movió entre contenedores (por ejemplo, de children a principal)
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

            // Opcional: actualizar parentId o similar
            const moved = event.container.data[event.currentIndex];
            if (parentList) {
                // Si está en el nivel raíz, por ejemplo:
                moved.parentId = null;
            }
        }

        // ✅ Recalcular orden y jerarquía completa
        MenuUtils.updateMenuHierarchy(this.filteredMenuList());

        // Verifica si hubo cambios
        this.hasChanges.set(this.hasOrderChanged());

        // Actualiza el tiempo del último cambio
        this.lastChangeTime.set(Date.now());
    }

    hasOrderChanged(): boolean {
        const current = MenuUtils.flattenMenu(this.filteredMenuList());
        const original = MenuUtils.flattenMenu(this.originMenuList());
        console.log('Current Flattened:', current, 'Original Flattened:', original);

        // Si ambos están vacíos, no hay cambios
        if (current.length === 0 && original.length === 0) return false;

        // Si la longitud difiere, algo cambió
        if (current.length !== original.length) return true;
        // Comparar item por item
        return current.some((item, i) => {
            const origin = original[i];
            return item.id !== origin.id || item.order !== origin.order || item.parentId !== origin.parentId;
        });
    }
}
