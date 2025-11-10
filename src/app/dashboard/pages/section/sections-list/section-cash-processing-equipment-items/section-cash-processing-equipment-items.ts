import { categoryTypesOptions } from '@/shared/interfaces/category';
import { Machine } from '@/shared/interfaces/machine';
import type { Section } from '@/shared/interfaces/section';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { CategoryType } from '@/shared/mappers/category.mapper';
import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import type { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';

@Component({
    selector: 'section-cash-processing-equipment-items',
    imports: [EmptyFieldMessage, ButtonModule, MenuModule, CarouselModule, CardModule, TagModule, ToggleSwitchModule, NgClass],
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
