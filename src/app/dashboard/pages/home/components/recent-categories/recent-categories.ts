import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { CommonModule, NgClass } from '@angular/common';
import { CategoryService } from '@/dashboard/services/category.service';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FallBack } from '@/shared/components/error/fall-back/fall-back';

@Component({
    selector: 'home-recent-categories',
    imports: [DataViewSkeleton, FallBack, NgClass, DataViewModule, FormsModule, CommonModule, ButtonModule],
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
