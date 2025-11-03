import type { Section } from '@/shared/interfaces/section';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { Component, computed, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CarouselModule } from 'primeng/carousel';
import type { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import { CardModule } from 'primeng/card';
import { Machine } from '@/shared/interfaces/machine';
import { TagModule } from 'primeng/tag';
import { Category, categoryTypesOptions } from '@/shared/interfaces/category';
import { CategoryType } from '@/shared/mappers/category.mapper';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { NgClass } from '@angular/common';
import { FilterArrayByPipe } from '@/shared/pipes/filter-array-by-pipe';

@Component({
    selector: 'section-cash-processing-equipment-items',
    imports: [EmptyFieldMessage, ButtonModule, MenuModule, FilterArrayByPipe, CarouselModule, CardModule, TagModule, ToggleSwitchModule, NgClass],
    templateUrl: './section-cash-processing-equipment-items.html'
})
export class SectionCashProcessingEquipmentItems {
    section = input.required<Section>();
    contextMenu = input<ContextMenuCrud<SectionItem>>();
    isPreview = input<boolean>(false);
    
    CategoryType = CategoryType;

    getOption(type: CategoryType) {
        return categoryTypesOptions[type];
    }

    getMainImageUrl(
    machine: Machine
  ) {
    const mainImage = machine.images?.find((img) => img.isMain) || machine.images?.[0];
    return mainImage ? mainImage.url : '';
  }

  filterByCategoryType(checked: boolean) {
    const type = checked ? CategoryType.COIN : CategoryType.BILL;
    return this.section().machines?.filter((machine) => machine.category?.type === type) || [];
  }

  
   responsiveOptions = computed(() => [
           
            {
                breakpoint: '1199px',
                numVisible: this.isPreview() ? 1 : 3,
                numScroll: 1,
            },
            {
                breakpoint: '767px',
                numVisible: this.isPreview() ? 1 : 2,
                numScroll: 1,
            },
            {
                breakpoint: '575px',
                numVisible: 1,
                numScroll: 1,
            },
        ]);
}
