import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { FormUtils } from '@/utils/form-utils';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'why-us-form',
  imports: [TextareaModule, MessageModule, ReactiveFormsModule, InputTextModule ],
  templateUrl: './why-us-form.html',
  styleUrl: './why-us-form.scss'
})
export class WhyUsForm {
  form = input.required<FormGroup<any>>();

 FormUtils  = FormUtils;
}
