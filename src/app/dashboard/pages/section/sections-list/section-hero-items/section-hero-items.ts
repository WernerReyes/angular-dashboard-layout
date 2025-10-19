import { ImageError } from '@/shared/components/error/image/image';
import { SectionItem } from '@/shared/interfaces/section-item';
import { Component, input, output, signal, ViewChild } from '@angular/core';
import { MenuItemCommandEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule, GalleriaResponsiveOptions } from 'primeng/galleria';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { DeleteSectionItemFunction } from '../sections-list';
import { HeroItem } from './hero-item/hero-item';
@Component({
    selector: 'section-hero-items',
    imports: [HeroItem, ContextMenuCrud, ButtonModule, TagModule, MenuModule, GalleriaModule, ImageError],
    templateUrl: './section-hero-items.html'
})
export class SectionHeroItems {
    sectionItems = input.required<SectionItem[]>();
    deleteItemConfirmation = input.required<DeleteSectionItemFunction>();
    onSelectSectionItem = output<SectionItem>();

    selectedItem = signal<SectionItem | null>(null);

    @ViewChild(ContextMenuCrud) contextMenu!: ContextMenuCrud<SectionItem>;

    
    
    edit = () => {
        this.onSelectSectionItem.emit(this.selectedItem()!);
    }

    delete = (event: MenuItemCommandEvent) => {
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
