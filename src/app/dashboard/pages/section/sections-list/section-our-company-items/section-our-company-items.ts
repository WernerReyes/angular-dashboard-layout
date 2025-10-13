import { Component, input, output, signal } from '@angular/core';
import type { Section } from '@/shared/interfaces/section';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import type { DeleteSectionItemFunction } from '../sections-list';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'section-our-company-items',
    imports: [EmptyFieldMessage, MenuModule, ButtonModule],
    templateUrl: './section-our-company-items.html'
})
export class SectionOurCompanyItems {
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
                // this.deleteSectionItem(event.originalEvent!);
                this.deleteItemConfirmation()(
                    event.originalEvent!,
                    {
                        id: this.selectedItem()!.id,
                        sectionId: this.selectedItem()!.sectionId
                    },
                    () => {
                        this.selectedItem.set(null);
                    }
                );
            }
        }
    ];
}
