import type { SectionItem } from '@/shared/interfaces/section-item';
import { Component, input, output, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import type { DeleteSectionItemFunction } from '../sections-list';
import { Section } from '@/shared/interfaces/section';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'section-value-proposition-items',
    imports: [CardModule, EmptyFieldMessage, MenuModule, ButtonModule],
    templateUrl: './section-value-proposition-items.html'
})
export class SectionValuePropositionItems {
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
