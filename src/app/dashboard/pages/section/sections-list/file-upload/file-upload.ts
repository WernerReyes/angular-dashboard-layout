import { ImageError } from '@/shared/components/error/image/image';
import { ImageType, imageTypeOptions, SectionItem } from '@/shared/interfaces/section-item';
import { FormUtils } from '@/utils/form-utils';
import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Button, ButtonModule } from "primeng/button";

export type ImageSelector = keyof Pick<SectionItem, 'image' | 'backgroundImage'>;

@Component({
    selector: 'file-upload',
    imports: [ImageError, FileUploadModule, Message, ImageModule, InputTextModule, ButtonModule, ReactiveFormsModule, SelectButtonModule],
    templateUrl: './file-upload.html'
})
export class FileUpload {
    imageType = input.required<ImageType>();
    form = input.required<FormGroup<any>>();
    imageTypeName = input.required<string>();
    imageFieldName = input.required<string>();
    imageURLName = input.required<string>();
    // imageSelector = input.required<ImageSelector>();
    currentImageName = input.required<'currentImage' | 'currentImageBack'>();
    label = input<string>();

    selectedSectionItem = input<SectionItem | null>(null);

    ImageType = ImageType;

    FormUtils = FormUtils;

    imagesTypeOptions = Object.values(imageTypeOptions);

    onFileSelect(event: FileSelectEvent) {
        const file = event.files[0];
        if (file) {
            this.form().patchValue({ [this.imageFieldName()]: file as any });
            this.form().get(this.imageFieldName())?.markAsTouched();
        }
    }
}
