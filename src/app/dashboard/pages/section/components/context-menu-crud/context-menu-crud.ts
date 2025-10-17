import { SectionItem } from '@/shared/interfaces/section-item';
import { Component, input, model, ViewChild } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';

@Component({
  selector: 'context-menu-crud',
  imports: [ContextMenuModule],
  templateUrl: './context-menu-crud.html',
})
export class ContextMenuCrud {
    editCommand = input.required<() => void>();
    deleteCommand = input.required<(event: MenuItemCommandEvent) => void>();

    selectedItem = model<SectionItem | null>(null);

    @ViewChild('cm') cm!: ContextMenu;


    items: MenuItem[] = [
        {
            label: 'Editar',
            icon: 'pi pi-fw pi-pencil',

            command: () => {
                this.editCommand()();
            }
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-fw pi-trash',
            command: (event: MenuItemCommandEvent) => {
                this.deleteCommand()(event);
               
            }
        }
    ];

    onContextMenu(event: any, item: any) {
        this.cm.target = event.currentTarget;
        this.cm.show(event);
        this.selectedItem.set(item);
    }

    onHide() {
        this.selectedItem.set(null);
    }
}
