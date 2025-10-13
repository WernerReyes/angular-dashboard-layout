import { AuthService } from '@/auth/services/auth.service';
import { userRoleOptions } from '@/shared/interfaces/user';
import { Component, inject, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InitialsPipe } from '@/pipes/initials-pipe';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogForm } from './components/dialog-form/dialog-form';
import { PatternsConst } from '@/shared/constants/patterns';

@Component({
    selector: 'app-setting-page',
    imports: [DialogForm, InitialsPipe, BadgeModule, ButtonModule, AvatarModule],
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
            lastname: this.user()!.lastname

        });
    }
}
