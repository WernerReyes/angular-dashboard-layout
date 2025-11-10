import { Component, input, model, ViewChild } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';

@Component({
  selector: 'context-menu-crud',
  imports: [ContextMenuModule],
  templateUrl: './context-menu-crud.html',
})
export class ContextMenuCrud<T> {
    editCommand = input.required<() => void>();
    deleteCommand = input.required<(event: MenuItemCommandEvent) => void>();
   

    selected = model<T | null>(null);

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

    onContextMenu(event: any, item:T) {
        this.cm.target = event.currentTarget;
        this.cm.show(event);
        this.selected.set(item);

        event.preventDefault();
        event.stopPropagation();
    }

    onHide() {
        // TODO: this.selected.set(null);
    }
}
