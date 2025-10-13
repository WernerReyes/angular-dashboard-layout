import { FormUtils } from '@/utils/form-utils';
import { Component, input, model } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'dialog-form',
    imports: [DialogModule, ReactiveFormsModule, InputTextModule, ButtonModule, MessageModule, FileUploadModule],
    templateUrl: './dialog-form.html'
})
export class DialogForm {
  
    form = input.required<FormGroup<any>>();
    display = model.required<boolean>();

    FormUtils = FormUtils;

    
  onFileSelect(event: FileSelectEvent) {
        const file = event.files[0];
        if (file) {
            this.form().patchValue({ "profileFile": file as any });
            this.form().get("profileFile")?.markAsTouched();
        }
    }

  
}
