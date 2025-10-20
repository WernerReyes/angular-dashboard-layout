import { FilterByIdsPipe } from '@/dashboard/pipes/filter-by-ids-pipe';
import { CategoryService } from '@/dashboard/services/category.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { ImageError } from '@/shared/components/error/image/image';
import type { Section } from '@/shared/interfaces/section';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { SplitterModule } from 'primeng/splitter';
import type { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
@Component({
    selector: 'section-machine-items',
    imports: [ErrorBoundary, ImageError, FilterByIdsPipe, SplitterModule, FormsModule, ListboxModule, CardModule, ButtonModule, MenuModule],
    templateUrl: './section-machine-items.html'
})
export class SectionMachineItems {
    private readonly breakpointObserver = inject(BreakpointObserver);
    private readonly categoryService = inject(CategoryService);

    categoryList = this.categoryService.categoryListResource;

    section = input.required<Section>();
    contextMenu = input.required<ContextMenuCrud<SectionItem>>();

 
    selectedCategoryId = signal<number | null>(null);

    categoriesIds = computed(() => {
        const ids = this.section()
            .items.map((item) => item.categoryId)
            .filter((id): id is number => id !== null);

        return ids.length ? ids : [-1];
    });

    isMobile = signal<boolean>(false);

   

    constructor() {
        this.breakpointObserver
            .observe(['(max-width: 768px)']) // también puedes usar '(max-width: 768px)'
            .subscribe((result) => {
                this.isMobile.set(result.matches);
            });
    }
}
