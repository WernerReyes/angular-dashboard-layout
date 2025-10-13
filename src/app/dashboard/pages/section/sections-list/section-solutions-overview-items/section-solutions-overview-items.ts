import type { Section } from '@/shared/interfaces/section';
import { Component, input, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import { DeleteSectionItemFunction } from '../sections-list';
import { SectionItem } from '@/shared/interfaces/section-item';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
    selector: 'section-solutions-overview-items',
    imports: [ButtonModule, CardModule, EmptyFieldMessage, MenuModule],
    templateUrl: './section-solutions-overview-items.html'
})
export class SectionSolutionsOverviewItems {
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
