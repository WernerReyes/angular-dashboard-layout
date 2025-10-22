import { MachineFormService } from '@/dashboard/pages/machine/services/machine-form.service';
import { Component, inject, model, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { FormUtils } from '@/utils/form-utils';
import { MessageModule } from 'primeng/message';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TecnicalSpecifications } from '@/shared/mappers/machine.mapper';
import { MenuItem } from 'primeng/api';
import { TechnicalSpecificationsTable } from '../../../technical-specifications-table/technical-specifications-table';
@Component({
    selector: 'technical-specifications-dialog-form',
    imports: [JsonPipe, TechnicalSpecificationsTable, DialogModule, TableModule, InputTextModule, ButtonModule, IftaLabelModule, ReactiveFormsModule, MessageModule, ContextMenuModule],
    templateUrl: './technical-specifications-dialog-form.html'
})
export class TechnicalSpecificationsDialogForm {
    private readonly fb = inject(FormBuilder);
    readonly machineFormService = inject(MachineFormService);
    private machineForm = this.machineFormService.machineForm;

    form = this.fb.group({
        id: [''],
        title: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', [Validators.required, Validators.minLength(3)]]
    });

    FormUtils = FormUtils;

    items: MenuItem[] = [
        {
            label: 'Editar',
            icon: 'pi pi-fw pi-pencil',
            command: () => {
                this.populateSpecificationForm(this.selectedSpecification()!);
            }
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-fw pi-trash',
            command: () => {
                const index = this.findSpecificationIndexById(this.selectedSpecification()!.id);
                this.specifications.removeAt(index);
                this.selectedSpecification.set(null);
            }
        }
    ];

    display = model.required<boolean>();

    selectedSpecification = signal<TecnicalSpecifications | null>(null);

    specificationToEdit = signal<TecnicalSpecifications | null>(null);

    get specifications() {
        return this.machineForm.get('technicalSpecifications') as FormArray;
    }

    addNewSpecification() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (this.specificationToEdit()) {
            const index = this.findSpecificationIndexById(this.specificationToEdit()!.id);
            this.specifications.at(index).patchValue(this.form.value);
            this.specificationToEdit.set(null);
        } else {
            const { title, description } = this.form.value;
            this.specifications?.push(
                this.fb.group({
                    id: [this.specifications.length + 1],
                    title: [title],
                    description: [description]
                })
            );
        }

        this.form.reset();
    }

    private populateSpecificationForm(specification: TecnicalSpecifications) {
        this.form.patchValue({
            id: specification.id,
            title: specification.title,
            description: specification.description
        });

        this.specificationToEdit.set(specification);
    }

    private findSpecificationIndexById(id: string): number {
        return this.specifications.value.findIndex((specification: TecnicalSpecifications) => specification.id === id);
    }
}
