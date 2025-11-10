import { MenuUtils } from '@/dashboard/utils/menu.utils';
import { ImageError } from '@/shared/components/error/image/image';
import { Menu } from '@/shared/interfaces/menu';
import { Section } from '@/shared/interfaces/section';
import { Component, computed, input } from '@angular/core';
import type { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
// TODO: Check CascadeSelectModule if needed
@Component({
    selector: 'section-main-navigation-menu-items',
    imports: [ImageError, MenubarModule],
    templateUrl: './section-main-navigation-menu-items.html'
})
export class SectionMainNavigationMenuItems {
    section = input.required<Section>();

    items = computed<MenuItem[]>(() => {
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


