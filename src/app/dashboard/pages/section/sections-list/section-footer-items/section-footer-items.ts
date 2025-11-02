import { MenuUtils } from '@/dashboard/utils/menu.utils';
import { Section } from '@/shared/interfaces/section';
import { SectionItem } from '@/shared/interfaces/section-item';
import { Component, computed, input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import type { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import { JsonPipe, NgClass } from '@angular/common';
import type { Menu } from '@/shared/interfaces/menu';
import { TieredMenuModule } from 'primeng/tieredmenu';
@Component({
    selector: 'section-footer-items',
    imports: [NgClass, EmptyFieldMessage, JsonPipe, TieredMenuModule, ButtonModule],
    templateUrl: './section-footer-items.html'
})
export class SectionFooterItems {
    section = input.required<Section>();
    contextMenu = input<ContextMenuCrud<SectionItem>>();
    currentSectionItem = input<SectionItem | null>();

    currentYear = new Date().getFullYear();

    items = [
    {
      "id": "2",
      "label": "Procesamiento de Billetes",
      "items": [
        {
          "id": "3",
          "label": "Valorizantes"
        }
      ]
    }
  ]

    menus = computed<MenuItem[]>(() => {
        const sectionData = this.section();
        if (!sectionData?.menus) {
            return [];
        }

        const menus = MenuUtils.buildReversedTree(sectionData.menus);

        const buildTree = (items: Menu[]): MenuItem[] => {
            return items.map((item) => ({
                id: item.id.toString(),
                label: item.title,
                // data: item.id,
                // key: String(item.id),
                items: item.children && item.children.length > 0 ? buildTree(item.children) : undefined
            }));
        };

        return buildTree(menus);
    });
}
