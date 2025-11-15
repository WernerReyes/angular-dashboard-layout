import { Component, input, model, ViewChild } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';

const HIGHLIGHT_CLASS = 'outline outline-2 outline-primary outline-offset-2 rounded-md';
@Component({
    selector: 'context-menu-crud',
    imports: [ContextMenuModule],

    template: `<p-contextMenu #cm [model]="items" (onHide)="onHide()"></p-contextMenu> `
})
export class ContextMenuCrud<T> {
    editCommand = input.required<() => void>();
    deleteCommand = input.required<(event: MenuItemCommandEvent) => void>();
    duplicateCommand = input<() => void>();

    selected = model<T | null>(null);

    private lastHighlightedElement: HTMLElement | null = null;

    @ViewChild('cm') cm!: ContextMenu;

    items: MenuItem[] = [
        {
            label: 'Duplicar',
            icon: 'pi pi-fw pi-copy',
            command: () => {
                this.duplicateCommand()?.();
            }
        },
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

    onContextMenu(event: any, item: T) {
        event.preventDefault();
        event.stopPropagation();

        const target = event.currentTarget as HTMLElement;

        // 🔹 Limpia el resaltado anterior (si existe)
        if (this.lastHighlightedElement && this.lastHighlightedElement !== target) {
            this.removeHighlight(this.lastHighlightedElement);
        }

        this.selected.set(item);

        // Mostrar menú
        this.cm.target = target;
        this.cm.show(event);

        // 🔹 Agregar estilo visual
        this.addHighlight(target);

        this.lastHighlightedElement = target;
    }

    onHide() {
        if (this.lastHighlightedElement) {
            this.removeHighlight(this.lastHighlightedElement);
            this.lastHighlightedElement = null;
        }
        this.selected.set(null);
    }

    private addHighlight(el: HTMLElement) {
        el.classList.add(...HIGHLIGHT_CLASS.split(' '));
    }

    private removeHighlight(el: HTMLElement) {
        el.classList.remove(...HIGHLIGHT_CLASS.split(' '));
    }
}
