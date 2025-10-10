import { FilterByTermPipe } from '@/dashboard/pipes/filter-by-term-pipe';
import { CategoryService } from '@/dashboard/services/category.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';


@Component({
    selector: 'categories-list',
    imports: [FilterByTermPipe, ErrorBoundary, DataViewSkeleton, FormsModule, DatePipe, NgClass, DataViewModule, InputGroupAddonModule, InputTextModule, InputGroupModule, ButtonModule],
    templateUrl: './categories-list.html'
})
export class CategoriesList {
    private readonly categoryService = inject(CategoryService);

    searchTerm = signal<string>('');

    categoriesList = this.categoryService.categoryListResource;
}
