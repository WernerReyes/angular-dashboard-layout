import { CommonModule, JsonPipe } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import type { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { Section } from '@/shared/interfaces/section';
import { Menu } from '@/shared/interfaces/menu';
import { ImageError } from '@/shared/components/error/image/image';

@Component({
    selector: 'section-main-navigation-menu-items',
    imports: [JsonPipe, ImageError, MenubarModule],
    templateUrl: './section-main-navigation-menu-items.html'
})
export class SectionMainNavigationMenuItems {
    section = input.required<Section>();

    items = computed<MenuItem[]>(() => {
        const sectionData = this.section();
        if (!sectionData?.menus) {
            return [];
        }

        const menus = this.buildMenuTree(sectionData.menus);

        return menus.map((menu) => ({
            label: menu.title,
            items: menu.children?.length
                ? menu.children.map((child) => ({
                      label: child.title
                  }))
                : undefined
        }));
    });

    buildMenuTree(menus: Menu[]): Menu[] {
        const tree: Menu[] = [];
        const parentsMap = new Map<number, Menu>();

        for (const menu of menus) {
            if (menu.parent) {
                const parentId = menu.parent.id;

                // Si aún no existe el padre en el mapa, lo creamos
                if (!parentsMap.has(parentId)) {
                    parentsMap.set(parentId, {
                        ...menu.parent,
                        children: []
                    });
                }

                // Agregamos el hijo al array de children del padre
                parentsMap?.get(parentId)?.children?.push({
                    ...menu,
                    children: [] // Inicializamos el array de children para el hijo
                });
            } else {
                // Si el menú no tiene padre, lo tratamos como raíz directamente
                tree.push({
                    ...menu,
                    children: [] // Inicializamos el array de children para el menú raíz
                });
            }
        }

        // Agregamos los padres al árbol final
        tree.push(...parentsMap.values());

        return tree;
    }
}
