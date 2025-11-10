import { ImageError } from '@/shared/components/error/image/image';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule, type GalleriaResponsiveOptions } from 'primeng/galleria';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import type { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { HeroItem } from './hero-item/hero-item';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
@Component({
    selector: 'section-hero-items',
    imports: [HeroItem, ButtonModule, EmptyFieldMessage, TagModule, MenuModule, GalleriaModule, ImageError],
    templateUrl: './section-hero-items.html'
})
export class SectionHeroItems {
    sectionItems = input.required<SectionItem[]>();
    contextMenu = input<ContextMenuCrud<SectionItem>>();
    // contextMenu = input.required<any>();

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
