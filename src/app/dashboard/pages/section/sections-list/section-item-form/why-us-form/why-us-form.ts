import { Component, inject } from '@angular/core';
import { CommonInputs } from '../../../components/common-inputs/common-inputs';
import { SectionItemFormService } from '../../../services/section-item-form.service';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'why-us-form',
    imports: [CommonInputs, ReactiveFormsModule, FileUploadModule],
    templateUrl: './why-us-form.html'
})
export class WhyUsForm {
    private readonly sectionItemFormService = inject(SectionItemFormService);

    form = this.sectionItemFormService.form;

    onFileSelect(event: FileSelectEvent) {
        const file = event.files[0];
        if (file) {
            this.form.patchValue({ iconFile: file as any });
            this.form.get('iconFile')?.markAsTouched();
        }
    }
}
