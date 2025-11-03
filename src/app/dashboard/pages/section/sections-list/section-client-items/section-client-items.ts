import { ImageError } from '@/shared/components/error/image/image';
import type { Section } from '@/shared/interfaces/section';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import type { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';

@Component({
    selector: 'section-client-items',
    imports: [NgClass, CarouselModule, ImageError, EmptyFieldMessage, ButtonModule],
    templateUrl: './section-client-items.html'
})
export class SectionClientItems {
    section = input.required<Section>();
   contextMenu = input<ContextMenuCrud<SectionItem>>();
   currentSectionItem = input<SectionItem | null>(null);
   isPreview = input<boolean>(false);

    responsiveOptions = computed(() => [
        {
            breakpoint: '1400px',
            numVisible: this.isPreview() ? 1 : 4,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: this.isPreview() ? 1 : 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: this.isPreview() ? 1 : 2,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ]);

   

   
}
