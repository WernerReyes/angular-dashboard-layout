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

type MenuComponent = Menu & {
    expanded?: boolean;
};

@Component({
    selector: 'menu-list',
    imports: [ErrorBoundary, DataViewSkeleton, ConfirmDialogModule, MessageModule, DragDropModule, FormsModule,  TagModule, DividerModule, BadgeModule, MenuModule, InputTextModule, InputGroupModule, InputGroupAddonModule, ButtonModule],
    templateUrl: './menu-list.html',
    providers: [ConfirmationService]
})
export class MenuList {
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


    originMenuList = linkedSignal<MenuComponent[]>(() => {
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

        targetList = signal<MenuComponent[]>([]);



    hasPositionChanged = signal(false);


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

     

        this.targetList.set(structuredClone(targetList));

        // Verifica si hubo cambios
        this.hasPositionChanged.set(this.hasOrderChanged());

       
    }


     savePositionChanges() {
        const newOrder = this.targetList().map((section, index) => ({ id: section.id, order: index + 1, parentId: section.parentId }));
        this.menuService.updateOrder(newOrder).subscribe({
            next: () => {
                this.menuList.update((menus) => {
                    if (!menus) return [];
                    return structuredClone(this.targetList());
                });
                this.originMenuList.set(structuredClone(this.targetList()));
                this.hasPositionChanged.set(false);
            }
        });
    }

    cancelChanges() {
        this.filteredMenuList.update((menus) => {
            if (!menus) return [];
            const original = this.originMenuList();
            return structuredClone(original);
        });
        this.hasPositionChanged.set(false);

        this.messageService.setSuccess('Los cambios han sido descartados correctamente.');
    }

    hasOrderChanged(): boolean {
        const current = MenuUtils.flattenMenu(this.filteredMenuList());
        const original = MenuUtils.flattenMenu(this.originMenuList());

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
