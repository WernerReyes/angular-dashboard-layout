import type { Section } from '@/shared/interfaces/section';
import { SectionItem } from '@/shared/interfaces/section-item';
import { Component, input, output, signal } from '@angular/core';
import type { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import type { DeleteSectionItemFunction } from '../sections-list';

@Component({
    selector: 'section-why-us-items',
    imports: [EmptyFieldMessage, CardModule, MenuModule, ButtonModule],
    templateUrl: './section-why-us-items.html'
})
export class SectionWhyUsItems {
    section = input.required<Section>();
    deleteItemConfirmation = input.required<DeleteSectionItemFunction>();
    onSelectSectionItem = output<SectionItem>();

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
                this.deleteItemConfirmation()(event.originalEvent!, {
                    id: this.selectedItem()!.id,
                    sectionId: this.section().id
                }, () => {
                    this.selectedItem.set(null);
                });
                // this.sectionItemUtils.deleteSectionItemConfirmation(event.originalEvent!, {
                //     id: this.selectedItem()!.id,
                //     sectionId: this.section().id
                // });
            }
        }
    ];
}
