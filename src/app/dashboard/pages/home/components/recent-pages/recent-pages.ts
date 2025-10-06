import { PageService } from '@/dashboard/services/page.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'home-recent-pages',
    imports: [
    ErrorBoundary,
    DataViewSkeleton,  DataViewModule, TagModule, FormsModule, DatePipe, SkeletonModule, CommonModule, ButtonModule,
   
],
    templateUrl: './recent-pages.html',
    styles: `
        ::ng-deep {
            .p-orderlist-list-container {
                width: 100%;
            }
        }
    `
})
export class RecentPages {
    private readonly breakpointObserver = inject(BreakpointObserver);
    private readonly pageService = inject(PageService);

    isMobile = false;

   

    pagesList = this.pageService.pagesListResource;

    recentPages = computed(() => (this.pagesList.hasValue() ? this.pagesList.value().slice(0, 5) : []));

    constructor() {
        this.breakpointObserver
            .observe(['(max-width: 768px)']) // también puedes usar '(max-width: 768px)'
            .subscribe((result) => {
                this.isMobile = result.matches;
            });
    }

    
}
