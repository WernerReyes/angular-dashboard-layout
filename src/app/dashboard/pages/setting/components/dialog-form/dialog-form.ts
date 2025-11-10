import { UpdateProfile } from '@/auth/interfaces/user';
import { AuthService } from '@/auth/services/auth.service';
import { FormUtils } from '@/utils/form-utils';
import { Component, inject, input, model, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'dialog-form',
    imports: [DialogModule, ReactiveFormsModule, InputTextModule, ButtonModule, MessageModule, FileUploadModule],
    templateUrl: './dialog-form.html'
})
export class DialogForm {
    readonly authService = inject(AuthService);
    @ViewChild('uploader') uploader!: FileUpload;

    form = input.required<FormGroup<any>>();
    display = model.required<boolean>();

    FormUtils = FormUtils;

    onFileSelect(event: FileSelectEvent) {
        const file = event.files[0];
        if (file) {
            this.form().patchValue({ profileFile: file as any });
            this.form().get('profileFile')?.markAsDirty();
        }
    }

    deleteImage() {
        this.form().patchValue({ profileFile: null, currentProfile: '' });
        this.form().get('profileFile')?.markAsDirty();
        this.uploader.clear();
    }

    onSubmit() {
        if (this.form().valid) {
            const formValue = this.form().value;
            const updateProfile: UpdateProfile = {
                firstName: formValue.name,
                lastName: formValue.lastname,
                email: formValue.email,
                profileFile: formValue.profileFile,
                currentProfileUrl: formValue.currentProfile
            };
            this.authService.updateProfile(updateProfile).subscribe({
                next: () => {
                    this.display.set(false);
                    this.form().reset();
                    this.uploader.clear();
                    // this.form().markAsUntouched();
                }
            });
        }
    }
}
