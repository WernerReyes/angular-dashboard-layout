import type { Section } from '@/shared/interfaces/section';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { DeleteSectionItemFunction } from '../sections-list';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { CategoryService } from '@/dashboard/services/category.service';
import { ListboxModule } from 'primeng/listbox';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { FilterByIdsPipe } from '@/dashboard/pipes/filter-by-ids-pipe';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
@Component({
    selector: 'section-machine-items',
    imports: [ErrorBoundary, FilterByIdsPipe, SplitterModule, FormsModule, ListboxModule, CardModule, ButtonModule],
    templateUrl: './section-machine-items.html'
})
export class SectionMachineItems {
    private readonly categoryService = inject(CategoryService);

    categoryList = this.categoryService.categoryListResource;

    section = input.required<Section>();
    deleteItemConfirmation = input.required<DeleteSectionItemFunction>();
    onSelectSectionItem = output<SectionItem>();

    selectedItem = signal<SectionItem | null>(null);
    selectedCategoryId = signal<number | null>(null);

    categoriesIds = computed(() =>
        this.section()
            .items.map((item) => item.categoryId)
            .filter((id): id is number => id !== null)
    );

    items: MenuItem[] = [
        {
            label: 'Editar',
            icon: 'pi pi-fw pi-pencil',

            command: () => {
                console.log('emitiendo item:', this.selectedItem());
                this.onSelectSectionItem.emit(this.selectedItem()!);
            }
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-fw pi-trash',
            command: (event: MenuItemCommandEvent) => {
                // this.deleteSectionItem(event.originalEvent!);
                this.deleteItemConfirmation()(
                    event.originalEvent!,
                    {
                        id: this.selectedItem()!.id,
                        sectionId: this.selectedItem()!.sectionId
                    },
                    () => {
                        this.selectedItem.set(null);
                    }
                );
            }
        }
    ];
}
