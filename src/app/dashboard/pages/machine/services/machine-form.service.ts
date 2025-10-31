import { Category } from '@/shared/interfaces/category';
import { Machine } from '@/shared/interfaces/machine';
import { CategoryType } from '@/shared/mappers/category.mapper';
import { TecnicalSpecifications } from '@/shared/mappers/machine.mapper';
import { inject, Injectable } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

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
        imagesToUpdate: [[] as { id: string, oldImage: string; newFile: File }[]],
        id: [null as number | null],
        name: ['', [Validators.required, Validators.minLength(3)]],
        shortDescription: ['', [Validators.required, Validators.minLength(10)]],
        fullDescription: ['', [Validators.required, Validators.minLength(20)]],
        fileImages: this.fb.control<File[]>([], [Validators.required, Validators.minLength(1)]),
        manualFile: [null as File | null],
        currentManual: [null as string | null],
        images: [[] as string[]],
        manual: ['' as string | null],
        imagesToDelete: [[] as string[]],
        technicalSpecifications: this.fb.array<TecnicalSpecifications>([], [Validators.required, Validators.minLength(1)]),
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
            id: machine.id,
            name: machine.name,
            shortDescription: machine.description,
            fullDescription: machine.longDescription,
            images: machine.images || [],
            manual: machine.manual || null,
            categoryId: machine.categoryId,
            currentManual: machine.manual || null
        });

        const currentImages = this.machineForm.get('images')?.value as string[];
        if (currentImages.length > 0) {
            this.machineForm.get('fileImages')?.clearValidators();
            this.machineForm.get('fileImages')?.updateValueAndValidity();  
        }

        const specsFormArray = this.technicalSpecificationsFormArray;
        specsFormArray?.clear();

        machine.technicalSpecifications?.forEach((spec) => {
            specsFormArray.push(
                this.fb.group({
                    id: [spec.id],
                    title: [spec.title],
                    description: [spec.description]
                })
            );
        });
    }

    get technicalSpecificationsFormArray() {
        return this.machineForm.get('technicalSpecifications') as FormArray;
    }



    resetCategoryForm() {
        this.categoryForm.reset();
    }

    resetMachineForm() {
        this.machineForm.reset();
        // this.machineForm.get('images')?.reset();
        this.technicalSpecificationsFormArray.clear();
        this.machineForm.get('categoryId')?.setValue(null);
    }

    get technicalSpecifications() {
        return this.machineForm.get('technicalSpecifications')?.value as TecnicalSpecifications[];
    }
}
