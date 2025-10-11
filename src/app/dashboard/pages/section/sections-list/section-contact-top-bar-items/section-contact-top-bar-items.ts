import type { Section } from '@/shared/interfaces/section';
import { Component, input, output, signal } from '@angular/core';
import { DeleteSectionItemFunction } from '../sections-list';
import type { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { SectionItem } from '@/shared/interfaces/section-item';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import { Image } from "primeng/image";
import { ImageError } from '@/shared/components/error/image/image';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'section-contact-top-bar-items',
  imports: [EmptyFieldMessage, ImageError, MenuModule, ButtonModule],
  templateUrl: './section-contact-top-bar-items.html',
})
export class SectionContactTopBarItems {
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
