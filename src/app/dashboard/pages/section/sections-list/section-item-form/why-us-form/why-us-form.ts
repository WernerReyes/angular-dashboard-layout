import { Component, inject } from '@angular/core';
import { CommonInputs } from '../common-inputs/common-inputs';
import { SectionItemFormService } from '../../../services/section-item-form.service';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'why-us-form',
    imports: [CommonInputs,ReactiveFormsModule, FileUploadModule],
    templateUrl: './why-us-form.html',
  
})
export class WhyUsForm {
    private readonly sectionItemFormService = inject(SectionItemFormService);

    form = this.sectionItemFormService.form;

    async onFileSelect(event: FileSelectEvent) {
      console.log(event.files[0])
        const blobUrl = (event.files[0] as any).objectURL.changingThisBreaksApplicationSecurity;
        const file = event.files[0];
        if (file) {
            this.form.patchValue({ iconFile: file as any });
            this.form.get('iconFile')?.markAsTouched();
        }
    }

   async blobUrlToFile(blobUrl: string, filename: string): Promise<File> {
    console.log(blobUrl);
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}

}
// this.form.get('iconFile')!.value