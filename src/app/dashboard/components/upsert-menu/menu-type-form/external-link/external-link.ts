import { FormUtils } from '@/utils/form-utils';
import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'menu-type-external-link',
    imports: [ToggleSwitchModule, InputTextModule, ReactiveFormsModule],
    templateUrl: './external-link.html'
})
export class ExternalLink {
    FormUtils = FormUtils;

    form = input.required<FormGroup>();
}
