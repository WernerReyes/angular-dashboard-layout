import { MenuUtils } from '@/dashboard/utils/menu.utils';
import { Menu } from '@/shared/interfaces/menu';
import { Section } from '@/shared/interfaces/section';
import { Component, computed, input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
    selector: 'section-footer-items',
    imports: [MenuModule, ButtonModule],
    templateUrl: './section-footer-items.html'
})
export class SectionFooterItems {
    section = input.required<Section>();
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

    toMenuItems(children: Menu[]): MenuItem[] {
        return children.map((child) => ({
            label: child.title
        }));
    }
}
