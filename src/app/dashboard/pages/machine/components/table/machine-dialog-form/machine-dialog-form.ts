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
import { StyleClass } from 'primeng/styleclass';
import { BadgeModule } from 'primeng/badge';

@Component({
    selector: 'machine-dialog-form',
    imports: [
        JsonPipe,
        TechnicalSpecificationsDialogForm,
        TechnicalSpecificationsTable,
        NgClass,
        ReactiveFormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        MessageModule,
        TextareaModule,
        FileUploadModule,
        AccordionModule,
        ImageCompareModule,
        BadgeModule,
      
    ],
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
        const images = this.images?.value || [];
        // const newAvailables = (images.length ?? 0) - this.availableImages().length;
        const rest = (images.length ?? 0) - (this.selectedImages().length);
        // this.disabledUpload.set(rest >= 5);
        const max = 5 - rest;
        // console.log('maxImagesArray computed:', { rest, max });
        return this.isEditMode ? max : 5;
    });

    display = model.required<boolean>();

    displayTechnicalSpecifications = signal<boolean>(false);

    selectedImages = signal<
        {
            image: string;
            type: 'update' | 'delete';
            
        }[]
    >([]);

    disabledUpload = linkedSignal(() => {
        const images = this.images?.value || [];
        // const newAvailables = (images.length ?? 0) - this.availableImages().length;
        const rest = (images.length ?? 0) - (this.selectedImages().length);
        return rest >= 5;
    });

    availableImages = signal<string[]>([]);

    private restImages = signal<number>(0);

    constructor() {
        this.images?.valueChanges.subscribe((imgs) => {
            this.disabledUpload.set((imgs?.length ?? 0) >= 5);
            this.availableImages.set(imgs || []);
        });

        // this.imagesToDelete?.valueChanges.subscribe((imgs) => {
        //     this.availableImages.update((available) => {
        //         return available.filter((img) => !imgs?.some((toDelete) => toDelete.delete === img));
        //     });
        // });
    }

    onImagesSelect(event: FileSelectEvent) {
        const files = event.currentFiles;
        if (this.isEditMode) {
            this.imagesToUpdate?.setValue([]);
            this.imagesToDelete?.setValue([]);

            for (let i = 0; i < this.selectedImages().length; i++) {
                const selected = this.selectedImages()[i];
                const file = files[i];
                const uuidFromFile = this.getUuidFromFile(file);
                if (selected.type === 'update') {
                    this.imagesToUpdate?.value?.push({ id: uuidFromFile, oldImage: selected.image, newFile: file });
                } else {
                    this.imagesToDelete?.value?.push({ id: uuidFromFile, delete: selected.image, newFile: file });
                }
            }

            // for (let i = 0; i < files.length; i++) {
            //     const file = files[i];
            //     const oldImage = this.selectedImages()[i];
            //     // if (oldImage) {
            //     //     // this.imagesToUpdate?.value?.push({ oldImage, newFile: file });
            //     // } else {
            //     //     const deleteImage = this.imagesToDelete?.value?.[i];
            //     //     if (deleteImage) {
            //     //         // this.imagesToDelete.value?.push({ delete: deleteImage.delete, newFile: file });
            //     //         deleteImage.newFile = file;
            //     //     } else {
            //     //         //* Delete the extra files
            //     //         this.imagesToDelete?.value?.splice(i, 1);
            //     //     }
            //     // }
            // }
        }

           console.log(files.length,  this.selectedImages().length)

        if (files.length > this.fileLimit()) {
            const rest = files.length - this.fileLimit();
            for (let i = 0; i < rest; i++) {
                const index = files.length - 1 - i;
                this.removeFile(event.originalEvent, index, files[index]);
            }
            return;
        }

        if (!this.isEditMode) {
            this.form.patchValue({ fileImages: files });
        }
    }

    removeFile(e: Event, index: number, file: File) {
        this.fileUpload.remove(e, index);
        const uuidFromFile = this.getUuidFromFile(file);
        const updatedImagesToUpdate = this.imagesToUpdate?.value?.filter((img) => img.id !== uuidFromFile);
        this.imagesToUpdate?.setValue(updatedImagesToUpdate ?? []);
        this.imagesToDelete?.setValue(this.imagesToDelete?.value?.map((img) => {
            if (img.id === uuidFromFile) {
                return { ...img, newFile: null };
            }
            return img;
        }) ?? []);

        console.log('Removing file:', { uuidFromFile });

        // this.imagesToUpdate?.value?.splice(index, 1);
    }

    onManualSelect(event: FileSelectEvent) {
        const file = event.currentFiles[0];
        this.form.patchValue({ manualFile: file });
    }

    includeImage(image: string) {
        return this.selectedImages().some((img) => img.image === image && img.type === 'update');
    }

    onSelectedImage(e: Event, image: string) {
        this.selectedImages.update((images) => {
            const index = images.findIndex((img) => img.image === image);
            if (index > -1) {
                images.splice(index, 1);
            } else {
                images.push({ image, type: 'update' });
            }
            return [...images];
        });

     
        if (this.fileUpload.files.length > this.selectedImages().length) {
            const rest = this.fileUpload.files.length - this.selectedImages().length;
            for (let i = 0; i < rest; i++) {
                const index = this.fileUpload.files.length - 1 - i;
                this.removeFile(e, index, this.fileUpload.files[index]);
            }
        }

        // const isDisabled = ((this.images?.value?.length ?? 0) - this.selectedImages().length) >= 5;
        // console.log({ isDisabled });
        // this.disabledUpload.set(isDisabled);
    }

    removeImage(e: Event, image: string) {
        e.stopPropagation();

        // const currentDeletes = this.imagesToDelete?.value || [];
        // this.imagesToDelete?.setValue([...currentDeletes, { delete: image }]);

        this.selectedImages.update((images) => {
            const index = images.findIndex((img) => img.image === image);
            if (index === -1) {
                images.push({ image, type: 'delete' });
            } else {
                images.splice(index, 1);
            }

            return [...images];
        });

        this.availableImages.update((available) => {
            return available.filter((img) => img !== image);
        });
    }

    selectedImageOrder(image?: string) {
        return this.selectedImages().findIndex((img) => img.image === image) + 1;
    }

     getUuidFromFile(file: File) {
        return (file as any)?.objectURL.changingThisBreaksApplicationSecurity.split('/').pop();
    }

    get images() {
        return this.form.get('images');
    }

    get imagesToDelete() {
        return this.form.get('imagesToDelete');
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
