import { FormUtils } from '@/utils/form-utils';
import { Component, input } from '@angular/core';
import { ReactiveFormsModule, type FormGroup } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';

type Field = 'title' | 'subtitle' | 'content' | 'textButton' | 'extraTextButton';

type InputType = 'text' | 'email' | 'number' | 'password' | 'url';


export interface IncludeFields {
  type: Field;          // 'title', 'subtitle', etc.
  label: string;         // Etiqueta visible
  placeholder?: string;  // Texto de placeholder
  isTextarea?: boolean;  // true si debe renderizar <textarea>
  inputType?: InputType; // Tipo de input, por ejemplo 'text', 'email', etc.
}


@Component({
    selector: 'common-inputs',
    imports: [InputTextModule, InputNumberModule, ReactiveFormsModule, MessageModule, TextareaModule],
    templateUrl: './common-inputs.html'
})
export class CommonInputs {
    // includeFields = input<Field[]>(['title', 'subtitle', 'content']);
    // inputType = input<InputType>('text');
    includeFields = input.required<IncludeFields[]>();


    form = input.required<FormGroup<any>>();

    FormUtils = FormUtils;
}
