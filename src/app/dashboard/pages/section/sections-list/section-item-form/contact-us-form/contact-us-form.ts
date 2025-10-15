import { Component, inject } from '@angular/core';
import { CommonInputs } from '../../../components/common-inputs/common-inputs';
import { SelectModule } from 'primeng/select';
import { SectionItemFormService } from '../../../services/section-item-form.service';
import { ReactiveFormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { inputTypeOptions } from '@/shared/interfaces/section-item';
import { FormUtils } from '@/utils/form-utils';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'contact-us-form',
    imports: [CommonInputs, SelectModule, KeyValuePipe, ReactiveFormsModule, MessageModule],
    templateUrl: './contact-us-form.html'
})
export class ContactUsForm {
    private readonly sectionItemFormService = inject(SectionItemFormService);
    form = this.sectionItemFormService.form;

    inputTypeOptions = inputTypeOptions;

    FormUtils = FormUtils;
}
