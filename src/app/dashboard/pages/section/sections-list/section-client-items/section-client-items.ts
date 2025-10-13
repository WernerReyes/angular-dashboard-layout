import { ImageError } from '@/shared/components/error/image/image';
import type { Section } from '@/shared/interfaces/section';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { NgClass } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import type { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { MenuModule } from 'primeng/menu';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import type { DeleteSectionItemFunction } from '../sections-list';

@Component({
    selector: 'section-client-items',
    imports: [NgClass, CarouselModule, ImageError, EmptyFieldMessage, MenuModule, ButtonModule],
    templateUrl: './section-client-items.html'
})
export class SectionClientItems {
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

    onSelectItem(item: SectionItem) {
        if (this.selectedItem() && this.selectedItem()!.id === item.id) {
            this.selectedItem.set(null);
            return;
        }
        this.selectedItem.set(item);
    }

    responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ];
}
