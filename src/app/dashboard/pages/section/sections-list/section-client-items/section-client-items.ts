import { ImageError } from '@/shared/components/error/image/image';
import type { Section } from '@/shared/interfaces/section';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
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
