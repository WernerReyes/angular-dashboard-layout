import { CategoryService } from '@/dashboard/services/category.service';
import { MachineService } from '@/dashboard/services/machine.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { categoryTypesOptions } from '@/shared/interfaces/category';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject, input, linkedSignal, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OverlayModeType } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectFilterEvent, MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';

// categoryTypesOptions

// TODO: When the machine is added for ay reason the type is null, so we need to handle that case

@Component({
    selector: 'select-machine',
    imports: [ErrorBoundary, ReactiveFormsModule, MultiSelectModule, InputTextModule, SelectButtonModule],
    templateUrl: './select-machine.html'
})
export class SelectMachine {
    private readonly breakpointObserver = inject(BreakpointObserver);
    private readonly categoryService = inject(CategoryService);
    private readonly machineService = inject(MachineService);

    machinesList = this.machineService.machinesListRs;
    categoriesList = this.categoryService.categoryListResource;
    categoryTypesOptions = Object.values(categoryTypesOptions);

    form = input.required<FormGroup>();
    label = input.required<string>();
    multiple = input<boolean>(false);
    mode = input<OverlayModeType>('overlay');

    isMobile = signal<boolean>(false);

    machines = linkedSignal(() => {
        const machines = this.machinesList.hasValue() ? this.machinesList.value() : [];

        console.log({
            machines
        })

        return machines.map((machine) => {
            const category = {
                ...machine.category,
                type: categoryTypesOptions[machine.category!.type]
            };

            return {
                ...machine,
                category
            };
        });
    });


    constructor() {
        this.breakpointObserver
            .observe(['(max-width: 30rem)']) // también puedes usar '(max-width: 768px)'
            .subscribe((result) => {
                this.isMobile.set(result.matches);
            });
    }

    onFilter(event: MultiSelectFilterEvent) {
        console.log(event);
        const filteredMachines = this.machines().filter((machine) => machine.name.toLowerCase().includes(event.filter!.toLowerCase()) || machine.category?.title?.toLowerCase().includes(event.filter!.toLowerCase()));
        this.machines.set(filteredMachines);
    }

    
}
