import { FormUtils } from '@/utils/form-utils';
import { Component, inject, model } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MachineFormService } from '../../../services/machine-form.service';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
    selector: 'machine-dialog-form',
    imports: [ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, MessageModule, TextareaModule, FileUploadModule],
    templateUrl: './machine-dialog-form.html'
})
export class MachineDialogForm {
    private readonly machineFormService = inject(MachineFormService);

    form = this.machineFormService.machineForm;

    display = model.required<boolean>();

    FormUtils = FormUtils;

    saveChanges() {
        throw new Error('Method not implemented.');
    }
}
