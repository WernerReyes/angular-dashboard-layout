import { FilterByTermPipe } from '@/dashboard/pipes/filter-by-term-pipe';
import { CategoryService } from '@/dashboard/services/category.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import { Category } from '@/shared/interfaces/category';
import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, input, model, signal } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'categories-list',
    imports: [FilterByTermPipe, ErrorBoundary, DataViewSkeleton, ConfirmDialogModule, FormsModule, DatePipe, NgClass, DataViewModule, InputGroupAddonModule, InputTextModule, InputGroupModule, ButtonModule],
    templateUrl: './categories-list.html',
    providers: [ConfirmationService]
})
export class CategoriesList {
    private readonly categoryService = inject(CategoryService);
    private readonly confirmationService = inject(ConfirmationService);

    form = input.required<FormGroup<any>>();
    display = model.required<boolean>();
    searchTerm = signal<string>('');

    categoriesList = this.categoryService.categoryListResource;

    populateForm(category: Category) {
        this.form().setValue({
            id: category.id,
            title: category.title,
            oldTitle: category.title
        });
        this.form().markAsPristine();
        this.display.set(true);
    }

    deleteCategory(event: Event, category: Category) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Estás seguro de que deseas eliminar esta categoría?',
            header: 'Eliminar categoría',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Eliminar'
            },
            accept: () => {
                this.categoryService.deleteCategory(category.id).subscribe({
                    next: () => {
                        this.confirmationService.close();
                    },
                    error: () => {
                        this.confirmationService.close();
                    }
                });
            },
            reject: () => {
                this.confirmationService.close();
            }
        });
    }
}
