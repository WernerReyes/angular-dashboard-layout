import { Component, inject, input } from '@angular/core';
import { ReactiveFormsModule, type FormGroup } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { FormUtils } from '@/utils/form-utils';
import { SectionItemFormService } from '../../../services/section-item-form.service';

type Field = 'title' | 'subtitle' | 'content';

@Component({
    selector: 'common-inputs',
    imports: [InputTextModule, ReactiveFormsModule, MessageModule, TextareaModule],
    templateUrl: './common-inputs.html'
})
export class CommonInputs {
    private readonly sectionItemFormService = inject(SectionItemFormService);
    includeFields = input<Field[]>(['title', 'subtitle', 'content']);
    
    form = this.sectionItemFormService.form;

    FormUtils = FormUtils;
}
