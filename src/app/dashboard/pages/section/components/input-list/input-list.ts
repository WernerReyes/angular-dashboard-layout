import type { AdditionalInfo } from '@/shared/mappers/section-item.mapper';
import { Component, input, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { type ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { OrderListModule } from 'primeng/orderlist';
@Component({
    selector: 'input-list',
    imports: [InputTextModule, OrderListModule, ReactiveFormsModule, ButtonModule, ContextMenuModule],
    templateUrl: './input-list.html',
    styles: `
        :host ::ng-deep .p-orderlist-controls {
            display: none;
        }
    `
})
export class InputList {
    form = input.required<FormGroup>();

    @ViewChild('cm') contextMenu!: ContextMenu;

    label = input.required<string>();

    inputTextValue = new FormControl<string>('');
    editMode = signal<boolean>(false);

    currentItem = signal<AdditionalInfo | null>(null);

    items: MenuItem[] = [
        {
            label: 'Eliminar',
            icon: 'pi pi-times',
            command: () => {
                const currentList = this.listControl?.value || [];
                if (this.currentItem()) {
                    const updatedList = currentList.filter((item: AdditionalInfo) => item.id !== this.currentItem()!.id);
                    this.listControl?.setValue(updatedList);
                    this.currentItem.set(null);
                    if (this.editMode()) {
                        this.inputTextValue.setValue('');
                        this.editMode.set(false);
                    }
                }
            }
        },
        {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () => {
                if (this.currentItem()) {
                    this.inputTextValue.setValue(this.currentItem()!.label);
                    this.editMode.set(true);
                }
            }
        }
    ];

    onContextMenu(event: any, item: AdditionalInfo) {
        event.preventDefault();

        this.currentItem.set(item);
        // this.inputTextValue.setValue(item.label);
        this.contextMenu.show(event);
        this.contextMenu.target = event.currentTarget;
    }

    get listControl() {
        return this.form().get('additionalInfoList');
    }

    save() {
        const currentList = this.listControl?.value || [];
        if (this.currentItem()) {
            // Edit existing item
            const updatedList = currentList.map((item: AdditionalInfo) => {
                if (item.id === this.currentItem()!.id) {
                    return { ...item, label: this.inputTextValue.value?.trim() };
                }
                return item;
            });
            this.listControl?.setValue(updatedList);
            this.currentItem.set(null);
            this.editMode.set(false);
        } else {
            const newItem: AdditionalInfo = {
                id: (currentList.length + 1).toString(),
                label: this.inputTextValue.value?.trim() || ''
            };
            this.listControl?.setValue([...currentList, newItem]);
        }

        this.inputTextValue.setValue('');
    }
}
