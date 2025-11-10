import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
    selector: 'video-upload',

    imports: [FileUploadModule, ImageModule, InputTextModule, ButtonModule, ReactiveFormsModule, SelectButtonModule],
    templateUrl: './video-upload.html'
})
export class VideoUpload {
    form = input.required<FormGroup>();

    onFileSelect(event: FileSelectEvent) {
        const file = event.files[0];
        if (file) {
            this.form().get('videoFile')?.patchValue(file);
            this.form().get('videoFile')?.markAsTouched();
        }
    }
}
