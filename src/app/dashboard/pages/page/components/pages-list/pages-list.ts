import { PageService } from '@/dashboard/services/page.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import type { Page } from '@/shared/interfaces/page';
import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PageFormService } from '../../services/page-form.service';

@Component({
    selector: 'pages-list',
    imports: [ErrorBoundary, DataViewSkeleton, NgClass, DatePipe, FormsModule, InputTextModule, InputGroupModule, InputGroupAddonModule, DataViewModule, ButtonModule],
    templateUrl: './pages-list.html'
})
export class PagesList {
    private readonly pagesService = inject(PageService);
    private readonly pageFormService = inject(PageFormService);

    onDisplay = output<boolean>();
    onSelectedPage = output<Page>();

    pagesList = this.pagesService.pagesListResource;

    searchQuery = signal<string>('');

    filteredPagesList = computed(() => {
        const query = this.searchQuery().toLowerCase();
        const pages = this.pagesList.hasValue() ? this.pagesList.value() : [];
        if (!query) return pages;
        return pages.filter((link) => link.title.toLowerCase().includes(query));
    });

    openDialogAndEdit(page: Page) {
        this.onDisplay.emit(true);
        this.onSelectedPage.emit(page);

        this.pageFormService.populateForm(page);
    }
}
