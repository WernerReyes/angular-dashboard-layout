import { FormUtils } from '@/utils/form-utils';
import { Component, input } from '@angular/core';
import { ReactiveFormsModule, type FormGroup } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';

type Field = 'title' | 'subtitle' | 'content';


export interface IncludeFields {
  type: Field;          // 'title', 'subtitle', etc.
  label: string;         // Etiqueta visible
  placeholder?: string;  // Texto de placeholder
  inputType?: string;    // 'text', 'email', 'number', etc.
  isTextarea?: boolean;  // true si debe renderizar <textarea>
}


@Component({
    selector: 'common-inputs',
    imports: [InputTextModule, ReactiveFormsModule, MessageModule, TextareaModule],
    templateUrl: './common-inputs.html'
})
export class CommonInputs {
    // includeFields = input<Field[]>(['title', 'subtitle', 'content']);
    includeFields = input.required<IncludeFields[]>();


    form = input.required<FormGroup<any>>();

    FormUtils = FormUtils;
}
