import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '@/auth/services/auth.service';
import type { LoginRequest } from '@/auth/interfaces/login';

@Component({
    selector: 'app-login-page',
    imports: [
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        RippleModule
        // AppFloatingConfigurator
    ],
    templateUrl: './login.page.html',
    styleUrl: './login.page.scss'
})
export default class LoginPage {
    private readonly authService = inject(AuthService);

    loginForm = new FormGroup({
        email: new FormControl('werner7@gmail.com', { nonNullable: true, validators: [Validators.required, Validators.email] }),
        password: new FormControl('holamundo', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
    });

    login() {
        this.authService.login(this.loginForm.value as LoginRequest);
    }
}
