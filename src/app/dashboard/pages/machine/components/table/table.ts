import { CategoryService } from '@/dashboard/services/category.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { Category, categoryTypesOptions } from '@/shared/interfaces/category';
import { CategoryType } from '@/shared/mappers/category.mapper';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, output, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MachineFormService } from '../../services/machine-form.service';
import { MachineDialogForm } from './machine-dialog-form/machine-dialog-form';
import { Popover, PopoverModule } from 'primeng/popover';
import { TechnicalSpecificationsTable } from '../technical-specifications-table/technical-specifications-table';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import { TecnicalSpecifications } from '@/shared/mappers/machine.mapper';
import { Machine } from '@/shared/interfaces/machine';
import { ImageModule } from 'primeng/image';
@Component({
    selector: 'table-machine',
    imports: [MachineDialogForm, TechnicalSpecificationsTable, DataViewSkeleton, ImageModule, TableModule, ErrorBoundary, DatePipe, TagModule, ToastModule, RatingModule, ButtonModule, PopoverModule, ContextMenuModule, ConfirmDialogModule],
    templateUrl: './table.html',
    providers: [ConfirmationService]
})
export class Table {
    private readonly confirmationService = inject(ConfirmationService);
    private readonly categoryService = inject(CategoryService);
    private readonly machineFormService = inject(MachineFormService);

    categoriesList = this.categoryService.categoryListResource;
    categoryTypesOptions = categoryTypesOptions;

    @ViewChild('op') op!: Popover;

    dialogMachine = signal<boolean>(false);

    selectedCategory = signal<Category | null>(null);
    onDisplayCategoryDialog = output<void>();


    selectedMachine = signal<Machine | null>(null);

    items: MenuItem[] = [
        {
            label: 'Agregar máquina',
            icon: 'pi pi-fw pi-plus',
            command: () => {
                this.dialogMachine.set(true);
                this.machineFormService.machineForm.patchValue({
                    categoryId: this.selectedCategory()!.id
                });
            }
        },
        {
            label: 'Editar',
            icon: 'pi pi-fw pi-pencil',
            command: () => {
                this.machineFormService.populateCategory(this.selectedCategory()!);
                this.onDisplayCategoryDialog.emit();
            }
            // command: () => this.selectedCategory.set(this.selectedCategory())
            // command: () => this.editCategory()
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-fw pi-trash',
            command: (event) => {
                this.confirmDeleteCategory(event.originalEvent!, this.selectedCategory()!);
            }
            // command: () => this.deleteCategory()
        }
    ];


     displaySpecifications(event: Event, machine: Machine) {
        if (this.selectedMachine()?.id === machine.id) {
            this.op.hide();
            this.selectedMachine.set(null);
        } else {
            this.selectedMachine.set(machine);
            this.op.show(event);

            if (this.op.container) {
                this.op.align();
            }
        }
    }

    hidePopover() {
        this.op.hide();
    }

    getType(type: CategoryType) {
        return this.categoryTypesOptions[type];
    }

    private confirmDeleteCategory(event: Event, category: Category) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: '¿Estás seguro de que deseas eliminar esta categoría?',
            header: 'Confirmar eliminación',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Guardar'
            },
            accept: () => {
                this.categoryService.deleteCategory(category.id).subscribe({
                    next: () => {
                        this.selectedCategory.set(null);
                    }
                });
            }
        });
    }
}
