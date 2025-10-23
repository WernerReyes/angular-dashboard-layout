import { CategoryService } from '@/dashboard/services/category.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import { Category, categoryTypesOptions } from '@/shared/interfaces/category';
import { Machine } from '@/shared/interfaces/machine';
import { CategoryType } from '@/shared/mappers/category.mapper';
import { DatePipe } from '@angular/common';
import { Component, inject, output, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { GalleriaModule, GalleriaResponsiveOptions } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { Popover, PopoverModule } from 'primeng/popover';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MachineFormService } from '../../services/machine-form.service';
import { TechnicalSpecificationsTable } from '../technical-specifications-table/technical-specifications-table';
import { MachineDialogForm } from './machine-dialog-form/machine-dialog-form';
import { TecnicalSpecifications } from '@/shared/mappers/machine.mapper';

@Component({
    selector: 'table-machine',
    imports: [
        MachineDialogForm,
        TechnicalSpecificationsTable,
        DataViewSkeleton,
        ImageModule,
        TableModule,
        ErrorBoundary,
        DatePipe,
        TagModule,
        ToastModule,
        RatingModule,
        ButtonModule,
        PopoverModule,
        ContextMenuModule,
        ConfirmDialogModule,
        GalleriaModule
    ],
    templateUrl: './table.html',
    providers: [ConfirmationService],
    styles: `
        ::ng-deep .p-galleria-nav-button {
            color: white !important;
            background: var(--primary-color) !important;
        }
    `
})
export class Table {
    private readonly confirmationService = inject(ConfirmationService);
    private readonly categoryService = inject(CategoryService);
    private readonly machineFormService = inject(MachineFormService);

    categoriesList = this.categoryService.categoryListResource;
    categoryTypesOptions = categoryTypesOptions;

    @ViewChild('op') op!: Popover;
    @ViewChild('machineCm') machineCm!: ContextMenu;

    dialogMachine = signal<boolean>(false);

    selectedCategory = signal<Category | null>(null);
    onDisplayCategoryDialog = output<void>();
    imagesGallery = signal<string[]>([]);
    specifications = signal<TecnicalSpecifications[]>([]);
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
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-fw pi-trash',
            command: (event) => {
                this.confirmDeleteCategory(event.originalEvent!, this.selectedCategory()!);
            }
        }
    ];

    machineItems: MenuItem[] = [
        {
            label: 'Editar Máquina',
            icon: 'pi pi-fw pi-pencil',
            command: () => {
                this.dialogMachine.set(true);
                this.machineFormService.populateMachine(this.selectedMachine()!);
            }
        },
        {
            label: 'Eliminar Máquina',
            icon: 'pi pi-fw pi-trash',
            command: () => {
                // Lógica para eliminar la máquina
            }
        }
    ];

    responsiveOptions: GalleriaResponsiveOptions[] = [
        {
            breakpoint: '1500px',
            numVisible: 5
        },
        {
            breakpoint: '1024px',
            numVisible: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    displaySpecifications(event: Event, specifications: TecnicalSpecifications[]) {
        const isSameSelectedMachine =
            this.specifications().length > 0 &&
            this.specifications().every((spec, index) => {
                return spec.id === specifications[index]?.id;
            });

        if (isSameSelectedMachine) {
            this.op.hide();
            this.specifications.set([]);
        } else {
            this.specifications.set(specifications);
            this.op.show(event);

            if (this.op.container) {
                this.op.align();
            }
        }
    }

    getType(type: CategoryType) {
        return this.categoryTypesOptions[type];
    }

    onContextMenu(event: any, machine: Machine) {
        this.machineCm.target = event.currentTarget;
        this.machineCm.show(event);
        this.selectedMachine.set(machine);
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
