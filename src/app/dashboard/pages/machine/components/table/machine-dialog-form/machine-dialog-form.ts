import { FormUtils } from '@/utils/form-utils';
import { Component, computed, inject, linkedSignal, model, type Signal, signal, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MachineFormService } from '../../../services/machine-form.service';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
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
import { BadgeModule } from 'primeng/badge';
import { SelectButton, SelectButtonModule } from 'primeng/selectbutton';
import { toSignal } from '@angular/core/rxjs-interop';
import { ShowLinkSwitch } from '@/dashboard/pages/section/components/show-link-switch/show-link-switch';

@Component({
    selector: 'machine-dialog-form',
    imports: [
        JsonPipe,
        TechnicalSpecificationsDialogForm,
        TechnicalSpecificationsTable,
        ShowLinkSwitch,
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
        SelectButtonModule,
        BadgeModule
    ],
    templateUrl: './machine-dialog-form.html'
})
export class MachineDialogForm {
    private readonly machineService = inject(MachineService);
    readonly machineFormService = inject(MachineFormService);

    @ViewChild('fileUp') fileUpload!: FileUpload;
    @ViewChild('manualFileUp') manualFileUpload!: FileUpload;
  

    optionSelectButtonControl = new FormControl<'update' | 'delete' | 'new'>('update');

    form = this.machineFormService.machineForm;
    FormUtils = FormUtils;
    loading = this.machineService.loading;

    optionSelectButton = toSignal(this.optionSelectButtonControl.valueChanges, { initialValue: this.optionSelectButtonControl.value }) as Signal<'update' | 'delete' | 'new'>;

    // maxImagesArray = Array.from({ length: 5 }, (_, i) => i + 1);

    fileLimit = computed(() => {
        let max = 5;
        if (this.optionSelectButton() === 'update') {
            const totalToUpdate = this.selectedImages().filter((img) => img.type === 'update').length;
            max = totalToUpdate;
        } else if (this.optionSelectButton() === 'delete') {
            const totalToDelete = this.selectedImages().filter((img) => img.type === 'delete');
            max = totalToDelete.length;
        }
        const res = this.optionSelectButton() !== 'new' ? max : 5 - (this.images()?.length ?? 0);

        return this.isEditMode ? res : 5;
    });

    display = model.required<boolean>();

    displayTechnicalSpecifications = signal<boolean>(false);

    selectedImages = signal<
        {
            image: string;
            type: 'update' | 'delete' | 'new';
        }[]
    >([]);

    currentImages = linkedSignal(() => {
        const images = this.images() || [];
        return Array.from({ length: 5 }, (_, i) => {
            const img = images[i];
            return img ? { image: img, disabled: false } : null;
        });
    });

    disabledUpload = linkedSignal(() => {
        const images = this.images() || [];
        let rest = (images.length ?? 0) - this.selectedImages().length;
        if (this.optionSelectButton() === 'update') {
            const totalToUpdate = this.selectedImages().filter((img) => img.type === 'update').length;
            rest = totalToUpdate;
        } else if (this.optionSelectButton() === 'delete') {
            const totalToDelete = this.selectedImages().filter((img) => img.type === 'delete');
            rest = totalToDelete.length;
        }
        return this.optionSelectButton() != 'new' ? rest <= 0 : rest >= 5;
    });

    // availableImages = signal<string[]>([]);

    images = toSignal(this.form.get('images')!.valueChanges, { initialValue: this.form.get('images')!.value }) as Signal<string[]>;

    private imagesToDeleteSignal = toSignal(this.form.get('imagesToDelete')!.valueChanges, { initialValue: this.form.get('imagesToDelete')!.value }) as Signal<string[]>;

    private fileImages = toSignal(this.form.get('fileImages')!.valueChanges, { initialValue: this.form.get('fileImages')!.value }) as Signal<File[]>;

    updateImagesOptions = computed(() => {
        const totalToUpdate = this.selectedImages().filter((img) => img.type === 'update').length;
        const totalToDelete = this.selectedImages().filter((img) => img.type === 'delete');
        const totalToAdd = this.fileImages()?.length ?? 0;
        // + (this.imagesToDeleteSignal()?.filter((img) => img).length ?? 0);

        return [
            { label: 'Actualizar', total: totalToUpdate, icon: 'pi pi-pencil', value: 'update', constant: totalToDelete.length > 0 || totalToAdd > 0 },
            { label: 'Eliminar', total: totalToDelete.length, icon: 'pi pi-times', value: 'delete', constant: totalToUpdate > 0 || totalToAdd > 0 },
            { label: 'Agregar Nuevos', total: totalToAdd, icon: 'pi pi-plus', value: 'new', constant: totalToUpdate > 0 || totalToDelete.length > 0 }
        ];
    });

    onImagesSelect(event: FileSelectEvent) {
        const control = this.form.get('fileImages');
        const files = event.currentFiles;
        if (this.isEditMode) {
            this.imagesToUpdate?.setValue([]);
            this.imagesToDelete?.setValue([]);
            control?.setValue([]);

            for (let i = 0; i < event.currentFiles.length; i++) {
                const selected = this.selectedImages()[i];
                const file = files[i];
                const uuidFromFile = this.getUuidFromFile(file);

                if (!file) continue;
                if (selected?.type === 'update') {
                    this.imagesToUpdate?.value?.push({ id: uuidFromFile, oldImage: selected.image, newFile: file });
                } else {
                    const control = this.form.get('fileImages');

                    const value = control?.value || [];
                    control?.setValue([...value, file]);
                }
            }
        }

        // let rest = 0;
        if (files.length > this.fileLimit()) {
            const rest = files.length - this.fileLimit();
            for (let i = 0; i < rest; i++) {
                const index = files.length - 1 - i;
                // this.fileUpload.remove(event.originalEvent, index);
                this.removeFile(event.originalEvent, index, files[index]);
            }
            // return;
            // this.fileUpload.remove(event.originalEvent, files.length - 1);
        }

        if (!this.isEditMode) {
            this.form.patchValue({ fileImages: files });
        }
    }

    removeFile(e: Event, index: number, file: File) {
        this.fileUpload.remove(e, index);
        const uuidFromFile = this.getUuidFromFile(file);
        // const updatedImagesToUpdate = this.imagesToUpdate?.value?.filter((img) => img.id !== uuidFromFile);
        // this.imagesToUpdate?.setValue(updatedImagesToUpdate ?? []);
        // this.imagesToDelete?.setValue(
        //     this.imagesToDeleteSignal()?.map((img) => {
        //         if (img.id === uuidFromFile) {
        //             return { ...img, newFile: null };
        //         }
        //         return img;
        //     }) ?? []
        // );
        this.form.get('fileImages')?.setValue(this.form.get('fileImages')?.value?.filter((f: File) => this.getUuidFromFile(f) !== uuidFromFile) ?? null);
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

        // if (this.fileUpload.files.length > this.selectedImages().length) {
        //     const rest = this.fileUpload.files.length - this.selectedImages().length;
        //     // if (this.fileLimit() <= 0) return;
        //     for (let i = 0; i < rest; i++) {
        //         const index = this.fileUpload.files.length - 1 - i;
        //         // this.removeFile(e, index, this.fileUpload.files[index]);
        //     }
        // }

     
    }

    removeImage(e: Event, image: string) {
        e.stopPropagation();

     
        this.selectedImages.update((images) => {
            const index = images.findIndex((img) => img.image === image);

            if (index === -1) {
                images.push({ image, type: 'delete' });
            } else {
                images.splice(index, 1);
            }

            return [...images];
        });

        const found = this.imagesToDeleteSignal()?.find((img) => img === image);

        this.imagesToDelete?.setValue(found ? (this.imagesToDeleteSignal()?.filter((img) => img !== image) ?? []) : [...(this.imagesToDeleteSignal() || []), image]);

        
        this.currentImages.update((current) => {
            const found = current.find((value) => value?.image === image);
            if (found) {
                const idx = current.indexOf(found);
                current[idx] = { image: found.image, disabled: !found.disabled };
            }
            return current;
        });
    }

    selectedImageOrder(image?: string | null) {
        return this.selectedImages().findIndex((img) => img.image === image) + 1;
    }

    getUuidFromFile(file: File) {
        return (file as any)?.objectURL.changingThisBreaksApplicationSecurity.split('/').pop();
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
        this.manualFileUpload.clear();
        console.log('Resetting selected images');
    }

    saveChanges() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const { name, shortDescription, fullDescription, fileImages, technicalSpecifications, categoryId, manualFile, id, imagesToDelete, imagesToUpdate, linkId, textButton } = this.form.value;

        const payload: CreateMachine = {
            name: name!,
            shortDescription: shortDescription!,
            fullDescription: fullDescription!,
            fileImages: fileImages!,
            technicalSpecifications: technicalSpecifications as any,
            categoryId: categoryId!,
            manualFile,
            linkId: linkId || null,
            textButton: textButton || null

        };

        if (this.isEditMode) {
            this.machineService.updateMachine({ id: id!, imagesToRemove: imagesToDelete!, imagesToUpdate: imagesToUpdate!, ...payload }).subscribe({
                next: () => {
                    this.closeDialog();
                    this.machineFormService.resetMachineForm();
                    // close
                }
            });
            return;
        }

        this.machineService.createMachine(payload).subscribe({
            next: () => {
                // this.display.set(false);
                this.closeDialog();
                this.machineFormService.resetMachineForm();
            }
        });
    }

    
}
