import { CommonModule, JsonPipe } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import type { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { Section } from '@/shared/interfaces/section';
import { Menu } from '@/shared/interfaces/menu';
import { ImageError } from '@/shared/components/error/image/image';
import { MenuUtils } from '@/dashboard/utils/menu.utils';

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
