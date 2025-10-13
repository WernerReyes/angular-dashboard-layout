import type { Section } from '@/shared/interfaces/section';
import { Component, input, output, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import { MenuModule } from 'primeng/menu';
import { DeleteSectionItemFunction } from '../sections-list';
import type { SectionItem } from '@/shared/interfaces/section-item';
import type  { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'section-mission-vision-items',
  imports: [EmptyFieldMessage, CardModule, MenuModule, ButtonModule],
  templateUrl: './section-mission-vision-items.html',
})
export class SectionMissionVisionItems {
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
