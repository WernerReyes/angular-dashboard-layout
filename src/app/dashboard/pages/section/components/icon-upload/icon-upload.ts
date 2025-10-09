import { Component, input } from '@angular/core';
import { ReactiveFormsModule, type FormGroup } from '@angular/forms';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'icon-upload',
  imports: [ReactiveFormsModule, FileUpload],
  templateUrl: './icon-upload.html',
})
export class IconUpload {

  form = input.required<FormGroup<any>>();
  iconFileName =  input.required<string>();
  currentIconUrlName =  input.required<string>();


  onFileSelect(event: FileSelectEvent) {
        const file = event.files[0];
        if (file) {
            this.form().patchValue({ [this.iconFileName()]: file as any });
            this.form().get(this.iconFileName())?.markAsTouched();
        }
    }

}
