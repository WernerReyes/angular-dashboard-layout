import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UpdatePassword as IUpdatePassword } from '@/auth/interfaces/user';
import { AuthService } from '@/auth/services/auth.service';

@Component({
    selector: 'update-password',
    imports: [ButtonModule, InputTextModule, ReactiveFormsModule],
    templateUrl: './update-password.html'
})
export class UpdatePassword {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);

    form = this.fb.group({
        password: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    onSubmit() {
        if (this.form.valid) {
            const formValue = this.form.value;
            const updatePassword: IUpdatePassword = {
                oldPassword: formValue.password!,
                newPassword: formValue.newPassword!
            };
            this.authService.updatePassword(updatePassword).subscribe({
                next: () => {
                    this.form.reset();
                }
            });
        }
    }
}
