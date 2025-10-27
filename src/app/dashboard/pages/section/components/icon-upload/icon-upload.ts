import { PickerIcons } from '@/shared/components/icon/picker-icons/picker-icons';
import { iconTypeOptions } from '@/shared/interfaces/section-item';
import { IconType } from '@/shared/mappers/section-item.mapper';
import { Component, effect, input, ViewChild } from '@angular/core';
import { ReactiveFormsModule, type FormGroup } from '@angular/forms';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'icon-upload',
  imports: [ReactiveFormsModule, FileUpload, PickerIcons, SelectButtonModule],
  templateUrl: './icon-upload.html',
})
export class IconUpload {
  @ViewChild('uploader') uploader!: FileUpload;

  form = input.required<FormGroup<any>>();
  iconFileName =  input.required<string>();
  currentIconUrlName =  input.required<string>();
  

  display = input.required<boolean>();

  private closeDialog = effect(() => {
    if (!this.display() && this.uploader?.files?.length) {
      this.uploader.clear();
    }
  });

  iconTypeOptions = Object.values(iconTypeOptions);
  
  IconType = IconType;

  onFileSelect(event: FileSelectEvent) {
        const file = event.files[0];
        if (file) {
            this.form().patchValue({ [this.iconFileName()]: file as any });
            this.form().get(this.iconFileName())?.markAsTouched();
        }
    }

}
