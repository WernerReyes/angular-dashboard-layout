import { Component, computed, inject, resource } from '@angular/core';

import { StatCard } from './stat-card/stat-card.js';
import { MenuService } from '@/dashboard/services/menu.service.js';

@Component({
    selector: 'home-stats-widget',
    imports: [StatCard],
    templateUrl: './stats-widget.html'
})
export class StatsWidget {
    private menuService = inject(MenuService);
    menuCount = resource({
        loader: () => this.menuService.getAllCount().toPromise()
    });

    stats = computed(() => {
        return [
          {
            title: 'Menú',
            value: this.menuCount.value() || 0,
            loading: this.menuCount.isLoading(),
            description: 'Items en el menú',
            icon: 'pi pi-align-justify',
            iconBackground: 'bg-cyan-100 dark:bg-cyan-400/10',
            iconColor: 'text-cyan-500'
        }
        ];
    });

    statsData = [
        {
            title: 'Páginas',
            value: 3,
            description: 'Páginas totales',
            icon: 'pi pi-file',
            iconBackground: 'bg-blue-100 dark:bg-blue-400/10',
            iconColor: 'text-blue-500'
        },
        {
            title: 'Enlaces',
            value: 4,
            description: 'Enlaces configurados',
            icon: 'pi pi-link',
            iconBackground: 'bg-orange-100 dark:bg-orange-400/10',
            iconColor: 'text-orange-500'
        },
        {
            title: 'Menú',
            value: 3,
            description: 'Items en el menú',
            icon: 'pi pi-align-justify',
            iconBackground: 'bg-cyan-100 dark:bg-cyan-400/10',
            iconColor: 'text-cyan-500'
        },
        {
            title: 'Categorías',
            value: 3,
            description: 'Categorías de productos',
            icon: 'pi pi-folder-open',
            iconBackground: 'bg-purple-100 dark:bg-purple-400/10',
            iconColor: 'text-purple-500'
        }
    ];
}
