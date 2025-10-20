import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { SectionService } from '@/dashboard/services/section.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { CategoryService } from '@/dashboard/services/category.service';
import { categoryTypesOptions } from '@/shared/interfaces/category';
import { CategoryType } from '@/shared/mappers/category.mapper';
@Component({
    selector: 'table-machine',
    imports: [TableModule, ErrorBoundary, TagModule, ToastModule, RatingModule, ButtonModule, CommonModule,],
    templateUrl: './table.html'
})
export class Table {
    private readonly categoryService = inject(CategoryService);

    categoriesList = this.categoryService.categoryListResource;

    categoryTypesOptions = categoryTypesOptions;

    getType(type: CategoryType) {
        return this.categoryTypesOptions[type];
    }

    customers = [
        {
            id: 1000,
            name: 'James Butt',
            country: {
                name: 'Algeria',
                code: 'dz'
            },
            company: 'Benton, John B Jr',
            date: '2015-09-13',
            status: 'unqualified',
            verified: true,
            activity: 17,
            representative: {
                name: 'Ioni Bowcher',
                image: 'ionibowcher.png'
            },
            balance: 70663
        }
    ];
}
