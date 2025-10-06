import { CategoryService } from '@/dashboard/services/category.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe, NgClass, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';

@Component({
    selector: 'home-recent-categories',
    imports: [
    ErrorBoundary,
    DataViewSkeleton, DatePipe, DataViewModule, ButtonModule,
    NgOptimizedImage, NgClass
 
],
    templateUrl: './recent-categories.html'
})
export class RecentCategories {
    private readonly breakpointObserver = inject(BreakpointObserver);
    private readonly categoryService = inject(CategoryService);

    categoriesList = this.categoryService.categoryListResource;

    recentCategories = computed(() => (this.categoriesList.hasValue() ? this.categoriesList.value().slice(0, 5) : []));

    isMobile = false;

    constructor() {
        this.breakpointObserver
            .observe(['(max-width: 768px)']) // también puedes usar '(max-width: 768px)'
            .subscribe((result) => {
                this.isMobile = result.matches;
            });
    }
}
