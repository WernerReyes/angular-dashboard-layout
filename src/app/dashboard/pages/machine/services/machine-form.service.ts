import { Category } from '@/shared/interfaces/category';
import { Machine } from '@/shared/interfaces/machine';
import { CategoryType } from '@/shared/mappers/category.mapper';
import { TecnicalSpecifications } from '@/shared/mappers/machine.mapper';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class MachineFormService {
    private readonly fb = inject(FormBuilder);

    categoryForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3)]],
        type: ['' as CategoryType, [Validators.required]],
        id: [null as number | null]
    });

    machineForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        shortDescription: ['', [Validators.required, Validators.minLength(10)]],
        fullDescription: ['', [Validators.required, Validators.minLength(20)]],
        images: this.fb.array<string>([], [Validators.required, Validators.minLength(1)]),
        technicalSpecifications: this.fb.array<TecnicalSpecifications>([]),
        categoryId: [null as number | null, [Validators.required]]
    });

    populateCategory(category: Category) {
        this.categoryForm.patchValue({
            title: category.title,
            type: category.type,
            id: category.id
        });
    }

    populateMachine(machine: Machine) {
        this.machineForm.patchValue({
            name: machine.name,
            shortDescription: machine.description,
            fullDescription: machine.longDescription,
            images: machine.images || [],
            technicalSpecifications: machine.technicalSpecifications || [],
            categoryId: machine.categoryId
        });
    }

    resetCategoryForm() {
        this.categoryForm.reset();
    }

    resetMachineForm() {
        this.machineForm.reset();
    }
}
