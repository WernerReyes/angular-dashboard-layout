import { MenuUtils } from '@/dashboard/utils/menu.utils';
import { Section } from '@/shared/interfaces/section';
import { SectionItem } from '@/shared/interfaces/section-item';
import { Component, computed, input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import type { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';

@Component({
    selector: 'section-footer-items',
    imports: [EmptyFieldMessage, MenuModule, ButtonModule],
    templateUrl: './section-footer-items.html'
})
export class SectionFooterItems {
    section = input.required<Section>();
    contextMenu = input.required<ContextMenuCrud<SectionItem>>();

    currentYear = new Date().getFullYear();

    menus = computed<MenuItem[]>(() => {
        const sectionData = this.section();
        if (!sectionData?.menus) {
            return [];
        }

        const menus = MenuUtils.buildMenuTree(sectionData.menus);

        return menus.map((menu) => ({
            id: menu.id.toString(),
            label: menu.title,
            items: menu.children?.length
                ? menu.children.map((child) => ({
                      id: child.id.toString(),
                      label: child.title
                  }))
                : undefined
        }));
    });

   
}
