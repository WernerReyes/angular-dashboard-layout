import type { Section } from '@/shared/interfaces/section';
import { Component, input, output, signal } from '@angular/core';
import type { DeleteSectionItemFunction } from '../sections-list';
import type { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { CarouselModule } from 'primeng/carousel';
import { NgClass, JsonPipe } from '@angular/common';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import { ImageError } from '@/shared/components/error/image/image';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'section-client-items',
  imports: [JsonPipe, NgClass, CarouselModule, ImageError, EmptyFieldMessage, MenuModule, ButtonModule],
  templateUrl: './section-client-items.html',

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
                console.log('emitiendo item:', this.selectedItem());
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

  products = [{
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
}, {
    id: '1200',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
}]

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
        ]

}
