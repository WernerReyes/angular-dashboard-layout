import { AuthService } from '@/auth/services/auth.service';
import { InitialsPipe } from '@/pipes/initials-pipe';
import { PatternsConst } from '@/shared/constants/patterns';
import { userRoleOptions } from '@/shared/interfaces/user';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogForm } from './components/dialog-form/dialog-form';
import { UpdatePassword } from './components/update-password/update-password';

@Component({
    selector: 'app-setting-page',
    imports: [DialogForm, UpdatePassword, InitialsPipe, BadgeModule, ButtonModule, AvatarModule, InputTextModule],
    templateUrl: './setting.page.html'
})
export default class SettingPage {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);

    form = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.pattern(PatternsConst.EMAIL)]],
        lastname: ['', [Validators.required, Validators.minLength(3)]],
        profileFile: [null as File | null],
        currentProfile: ['']
    });

    user = this.authService.user;

    roleOptions = userRoleOptions;

    display = signal<boolean>(false);

    openAndPopulateDialog() {
        this.display.set(true);
        this.form.patchValue({
            name: this.user()!.name,
            email: this.user()!.email,
            lastname: this.user()!.lastname,
            currentProfile: this.user()!.profile

        });
    }
}
