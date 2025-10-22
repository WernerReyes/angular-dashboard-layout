import { FormUtils } from '@/utils/form-utils';
import { Component, inject, model, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MachineFormService } from '../../../services/machine-form.service';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { AccordionModule } from 'primeng/accordion';
import { TechnicalSpecificationsDialogForm } from './technical-specifications-dialog-form/technical-specifications-dialog-form';
import { TechnicalSpecificationsTable } from '../../technical-specifications-table/technical-specifications-table';
import { JsonPipe } from '@angular/common';
import { CreateMachine } from '@/dashboard/interfaces/machine';
import { MachineService } from '@/dashboard/services/machine.service';
import { TecnicalSpecifications } from '@/shared/mappers/machine.mapper';

@Component({
    selector: 'machine-dialog-form',
    imports: [JsonPipe, TechnicalSpecificationsDialogForm, TechnicalSpecificationsTable, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, MessageModule, TextareaModule, FileUploadModule, AccordionModule],
    templateUrl: './machine-dialog-form.html'
})
export class MachineDialogForm {
    private readonly machineService = inject(MachineService);
    readonly machineFormService = inject(MachineFormService);

    form = this.machineFormService.machineForm;
    FormUtils = FormUtils;
    loading = this.machineService.loading;

    display = model.required<boolean>();

    displayTechnicalSpecifications = signal<boolean>(false);


    onFileSelect(event: FileSelectEvent) {
        const files = event.currentFiles;
        this.form.patchValue({ fileImages: files });
    }

    

    saveChanges() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const { name, shortDescription, fullDescription, fileImages, technicalSpecifications, categoryId } = this.form.value;

        const payload: CreateMachine = {
            name: name!,
            shortDescription: shortDescription!,
            fullDescription: fullDescription!,
            fileImages: fileImages!,
            technicalSpecifications: technicalSpecifications as any,
            categoryId: categoryId!
        };

        console.log('Payload to create machine:', payload);

        this.machineService.createMachine(payload).subscribe({
            next: () => {
              
                this.display.set(false);
                this.machineFormService.resetMachineForm();
            }
        });
    }
}
