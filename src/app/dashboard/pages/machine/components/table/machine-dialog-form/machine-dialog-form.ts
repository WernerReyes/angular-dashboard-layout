import { FormUtils } from '@/utils/form-utils';
import { Component, computed, inject, linkedSignal, model, signal, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MachineFormService } from '../../../services/machine-form.service';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { AccordionModule } from 'primeng/accordion';
import { TechnicalSpecificationsDialogForm } from './technical-specifications-dialog-form/technical-specifications-dialog-form';
import { TechnicalSpecificationsTable } from '../../technical-specifications-table/technical-specifications-table';
import { JsonPipe, NgClass } from '@angular/common';
import { CreateMachine } from '@/dashboard/interfaces/machine';
import { MachineService } from '@/dashboard/services/machine.service';
import { ImageCompareModule } from 'primeng/imagecompare';

import { TecnicalSpecifications } from '@/shared/mappers/machine.mapper';
import { StyleClass } from "primeng/styleclass";

@Component({
    selector: 'machine-dialog-form',
    imports: [JsonPipe, TechnicalSpecificationsDialogForm, TechnicalSpecificationsTable, NgClass, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, MessageModule, TextareaModule, FileUploadModule, AccordionModule, ImageCompareModule, StyleClass],
    templateUrl: './machine-dialog-form.html'
})
export class MachineDialogForm {
    private readonly machineService = inject(MachineService);
    readonly machineFormService = inject(MachineFormService);

    @ViewChild('fileUp') fileUpload!: FileUpload;

    form = this.machineFormService.machineForm;
    FormUtils = FormUtils;
    loading = this.machineService.loading;

    maxImagesArray = Array.from({ length: 5 }, (_, i) => i + 1);

    fileLimit = computed(() => {
        const rest = (this.images?.value?.length ?? 0) - this.selectedImages().length;
        const max = 5 - rest;
        // console.log('maxImagesArray computed:', { rest, max });
        return this.isEditMode ? max : 5;
    });

    display = model.required<boolean>();

    displayTechnicalSpecifications = signal<boolean>(false);

    selectedImages = signal<string[]>([]);

    disabledUpload = linkedSignal(() => {
        return false;
    });

    constructor() {
        this.images?.valueChanges.subscribe((imgs) => {
            this.disabledUpload.set((imgs?.length ?? 0) >= 5);
        });
    }

    onImagesSelect(event: FileSelectEvent) {
        const files = event.currentFiles;
        if (this.isEditMode) {
            this.imagesToUpdate?.setValue([]);
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const oldImage = this.selectedImages()[i] || '';
                this.imagesToUpdate?.value?.push({ oldImage, newFile: file });
            }
        }

        if (files.length > this.fileLimit()) {
            const rest = files.length - this.fileLimit();
            for (let i = 0; i < rest; i++) {
                this.removeFile(event.originalEvent, files.length - 1 - i);
            }
            return;
        }

        if (!this.isEditMode) {
            this.form.patchValue({ fileImages: files });
        }
    }

    removeFile(e: Event, index: number) {
        this.fileUpload.remove(e, index);

        this.imagesToUpdate?.value?.splice(index, 1);
    }

    onManualSelect(event: FileSelectEvent) {
        const file = event.currentFiles[0];
        this.form.patchValue({ manualFile: file });
    }

    onSelectedImage(e: Event, image: string) {
        this.selectedImages.update((images) => {
            const index = images.indexOf(image);
            if (index > -1) {
                images.splice(index, 1);
            } else {
                images.push(image);
            }
            return [...images];
        });

        if (this.fileUpload.files.length > this.selectedImages().length) {
            const rest = this.fileUpload.files.length - this.selectedImages().length;
            for (let i = 0; i < rest; i++) {
                this.removeFile(e, this.fileUpload.files.length - 1 - i);
            }
        }
   console.log( this.images?.value?.length ,  this.selectedImages().length);

        const isDisabled = ((this.images?.value?.length ?? 0) - this.selectedImages().length) >= 5;
        console.log({ isDisabled });
        this.disabledUpload.set(isDisabled);
    }

    get images() {
        return this.form.get('images');
    }

    get imagesToUpdate() {
        return this.form.get('imagesToUpdate');
    }
    get isEditMode() {
        return !!this.form.get('id')?.value;
    }

    closeDialog() {
        this.display.set(false);
        this.machineFormService.resetMachineForm();
        this.selectedImages.set([]);
        this.imagesToUpdate?.setValue([]);
        this.fileUpload.clear();
        console.log('Resetting selected images');
    }

    saveChanges() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const { name, shortDescription, fullDescription, fileImages, technicalSpecifications, categoryId, manualFile } = this.form.value;

        const payload: CreateMachine = {
            name: name!,
            shortDescription: shortDescription!,
            fullDescription: fullDescription!,
            fileImages: fileImages!,
            technicalSpecifications: technicalSpecifications as any,
            categoryId: categoryId!,
            manualFile
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
