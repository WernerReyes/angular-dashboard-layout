import { Component, computed, inject, Resource } from '@angular/core';
import { CategoryService } from '@/dashboard/services/category.service.js';
import { MenuService } from '@/dashboard/services/menu.service.js';
import { PageService } from '@/dashboard/services/page.service.js';
import { StatCard } from './stat-card/stat-card.js';
import { LinkService } from '@/dashboard/services/link.service.js';
import type { ResourceState } from '@/shared/interfaces/resource.js';

@Component({
    selector: 'home-stats-widget',
    imports: [StatCard],
    templateUrl: './stats-widget.html'
})
export class StatsWidget {
    private readonly menuService = inject(MenuService);
    private readonly pageService = inject(PageService);
    private readonly categoryService = inject(CategoryService);
    private readonly linkService = inject(LinkService);

    private pageList = this.pageService.pagesListResource;
    private menuList = this.menuService.menuListResource;
    private categoriesList = this.categoryService.categoryListResource;
    private linksList = this.linkService.linksListResource;

    stats = computed(() => {
        return [
            {
                id: 'pages',
                title: 'Páginas',
                value: this.getValue(this.pageList),
                resource: this.pageList,
                message: 'No se pudieron cargar los datos de las páginas.',
                description: 'Páginas totales',
                icon: 'pi pi-file',
                iconBackground: 'bg-blue-100 dark:bg-blue-400/10',
                iconColor: 'text-blue-500'
            },
            {
                id: 'links',
                title: 'Enlaces',
                value: this.getValue(this.linksList),

                resource: this.linksList,
                message: 'No se pudieron cargar los datos de los enlaces.',
                description: 'Enlaces totales',
                icon: 'pi pi-link',
                iconBackground: 'bg-orange-100 dark:bg-orange-400/10',
                iconColor: 'text-orange-500'
            },
            {
                id: 'menu',
                title: 'Menú',
                value: this.getValue(this.menuList),
                resource: this.menuList,
                message: 'No se pudieron cargar los datos del menú.',
                description: 'Items en el menú',
                icon: 'pi pi-align-justify',
                iconBackground: 'bg-cyan-100 dark:bg-cyan-400/10',
                iconColor: 'text-cyan-500'
            },
            {
                id: 'categories',
                title: 'Categorías',
                value: this.getValue(this.categoriesList),
                resource: this.categoriesList,
                message: 'No se pudieron cargar los datos de las categorías.',
                description: 'Categorías de productos',
                icon: 'pi pi-folder-open',
                iconBackground: 'bg-purple-100 dark:bg-purple-400/10',
                iconColor: 'text-purple-500'
            }
        ];
    });

    private getValue<T>(list: ResourceState<T[]>): string | number {
        return list.hasValue() ? (list.value()?.length ?? 0) : '';
    }
}
