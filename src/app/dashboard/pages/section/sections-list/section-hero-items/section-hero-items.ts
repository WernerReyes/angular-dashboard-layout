import { ImageError } from '@/shared/components/error/image/image';
import { SectionItem } from '@/shared/interfaces/section-item';
import { Component, effect, input, output, signal } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule, GalleriaResponsiveOptions } from 'primeng/galleria';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { DeleteSectionItemFunction } from '../sections-list';
import { HeroItem } from './hero-item/hero-item';

// TODO: Use Gallery component from primeng instead of Carousel
@Component({
    selector: 'section-hero-items',
    imports: [HeroItem, CarouselModule, ButtonModule, TagModule, MenuModule, GalleriaModule, ImageError],
    templateUrl: './section-hero-items.html'
})
export class SectionHeroItems {
    // private readonly sectionItemService = inject(SectionItemService);
    // private readonly confirmationService = inject(ConfirmationService);

    sectionItems = input.required<SectionItem[]>();
    deleteItemConfirmation = input.required<DeleteSectionItemFunction>();
    onSelectSectionItem = output<SectionItem>();

    selectedItem = signal<SectionItem | null>(null);

    onActiveIndexChange(index: number) {
        this.selectedItem.set(this.sectionItems()[index]);
    }

    private initSelectedItem = effect(() => {
        const items = this.sectionItems();

        if (this.selectedItem() === null && items.length > 0) {
            this.selectedItem.set(items[0]);
        } else if (this.selectedItem() && items.length > 0) {
            const currentItem = items.find((item) => item.id === this.selectedItem()?.id) || null;
            this.selectedItem.set(currentItem);
        }
    });

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


    responsiveOptions: GalleriaResponsiveOptions[] = [
        {
            breakpoint: '1300px',
            numVisible: 3
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];
}
