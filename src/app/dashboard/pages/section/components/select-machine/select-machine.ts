import { CategoryService } from '@/dashboard/services/category.service';
import { MachineService } from '@/dashboard/services/machine.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { categoryTypesOptions } from '@/shared/interfaces/category';
import { CategoryType } from '@/shared/mappers/category.mapper';
import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OverlayModeType } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
    selector: 'select-machine',
    imports: [ErrorBoundary, ReactiveFormsModule, MultiSelectModule, SelectButtonModule],
    templateUrl: './select-machine.html'
})
export class SelectMachine {
    private readonly categoryService = inject(CategoryService);
    private readonly machineService = inject(MachineService);

    machinesList = this.machineService.machinesListRs;
    categoriesList = this.categoryService.categoryListResource;
    categoryTypesOptions = Object.values(categoryTypesOptions);

    form = input.required<FormGroup>();
    label = input.required<string>();
    multiple = input<boolean>(false);
    mode = input<OverlayModeType>('overlay');

    currentOptionControl = new FormControl<CategoryType | null>(null);
    categoriesIdsControl = new FormControl<number[]>([]);

    private currentOptionValue = toSignal(this.currentOptionControl.valueChanges, { initialValue: this.currentOptionControl.value });
    private categoriesIdsValue = toSignal(this.categoriesIdsControl.valueChanges, { initialValue: this.categoriesIdsControl.value });

    filteredMachinesList = computed(() => {
        const currentValue = this.currentOptionValue();
        const currentCategoriesIds = this.categoriesIdsValue();
        const machines = this.machinesList.hasValue() ? this.machinesList.value() : [];

        let filteredMachines = machines;

        if (currentValue) {
            filteredMachines = filteredMachines.filter((machine) => machine.category?.type === currentValue);
        }
        if (currentCategoriesIds?.length ?? 0 > 0) {
            filteredMachines = filteredMachines.filter((machine) => currentCategoriesIds?.includes(machine.category!.id));
        }

        return filteredMachines;
    });
}
