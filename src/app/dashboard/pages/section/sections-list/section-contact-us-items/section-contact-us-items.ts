import type { Section } from '@/shared/interfaces/section';
import { Component, input, output, signal } from '@angular/core';
import type { DeleteSectionItemFunction } from '../sections-list';
import type { SectionItem } from '@/shared/interfaces/section-item';
import type { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputType } from '@/shared/mappers/section-item.mapper';
import { JsonPipe } from '@angular/common';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';

@Component({
    selector: 'section-contact-us-items',
    imports: [EmptyFieldMessage, ButtonModule, JsonPipe, InputTextModule, TextareaModule],
    templateUrl: './section-contact-us-items.html'
})
export class SectionContactUsItems {
    section = input.required<Section>();
    deleteItemConfirmation = input.required<DeleteSectionItemFunction>();
    onSelectSectionItem = output<SectionItem>();

    InputType = InputType;

    selectedItem = signal<SectionItem | null>(null);

    items: MenuItem[] = [
        {
            label: 'Editar',
            icon: 'pi pi-fw pi-pencil',

            command: () => {
                this.onSelectSectionItem.emit(this.selectedItem()!);
            }
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-fw pi-trash',
            command: (event: MenuItemCommandEvent) => {
                this.deleteItemConfirmation()(
                    event.originalEvent!,
                    {
                        id: this.selectedItem()!.id,
                        sectionId: this.section().id
                    },
                    () => {
                        this.selectedItem.set(null);
                    }
                );
            }
        }
    ];
}
