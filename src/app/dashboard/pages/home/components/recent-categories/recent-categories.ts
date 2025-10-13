import { CategoryService } from '@/dashboard/services/category.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';

@Component({
    selector: 'home-recent-categories',
    imports: [
    ErrorBoundary,
    DataViewSkeleton, DatePipe, DataViewModule, ButtonModule,
   NgClass
 
],
    templateUrl: './recent-categories.html'
})
export class RecentCategories {
   
    private readonly categoryService = inject(CategoryService);

    categoriesList = this.categoryService.categoryListResource;

    recentCategories = computed(() => (this.categoriesList.hasValue() ? this.categoriesList.value().slice(0, 7) : []));

    

    
}
