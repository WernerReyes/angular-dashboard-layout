import { ImageError } from '@/shared/components/error/image/image';
import { ImageType, imageTypeOptions, SectionItem } from '@/shared/interfaces/section-item';
import { FormUtils } from '@/utils/form-utils';
import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
    selector: 'video-upload',

    imports: [ImageError, FileUploadModule, Message, ImageModule, InputTextModule, ButtonModule, ReactiveFormsModule, SelectButtonModule],
    templateUrl: './video-upload.html'
})
export class VideoUpload {
    form = input.required<FormGroup>();

    onFileSelect(event: FileSelectEvent) {
        const file = event.files[0];
        if (file) {
        }
    }
}
