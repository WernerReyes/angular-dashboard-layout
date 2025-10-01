import { PageService } from '@/dashboard/services/page.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Router } from '@angular/router';

@Component({
    selector: 'app-pages.page',
    imports: [DatePipe, ButtonModule, CommonModule, DataViewModule, BadgeModule, InputTextModule, InputGroupModule, InputGroupAddonModule],
    templateUrl: './pages.page.html'
})
export default class PagesPage {
    private readonly router = inject(Router);
    readonly pageService = inject(PageService);

    showActions = signal<{
        [key: string]: boolean;
    }>({});

    searchTerm = signal<string>('');

    pages = computed(() => {
        const term = this.searchTerm().toLowerCase();
        if (!term) {
            return this.pageService.pagesList();
        }

        return this.pageService.pagesList().filter((page) => page.title.toLowerCase().includes(term));
    });

    navigateToNewPage() {
        this.router.navigate(['/dashboard/pages/new']);
    }

    // constructor(private productService: ProductService) {}

    setShowAction(id: number, value: boolean) {
        if (this.showActions()[id] === value) return;
        this.showActions.update((current) => ({
            ...current,
            [id]: value
        }));
    }
}
