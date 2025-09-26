import { computed, inject, Injectable, signal } from '@angular/core';
import type { LoginRequest, LoginResponse } from '../interfaces/login';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import type { User } from '@/shared/interfaces/user';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs';
import { ApiResponse } from '../../shared/interfaces/api-response';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly prefix = '/auth';

    user = signal<User | null>(null);

    isAuthenticated = computed(() => !!this.user());

    login(loginRequest: LoginRequest) {
        return this.http
            .post<ApiResponse<LoginResponse>>(`${environment.apiUrl}${this.prefix}/login`, loginRequest, {
                withCredentials: true
            })
            .subscribe({
                next: (response) => {
                    this.user.set(response.data.user);
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    this.user.set(null);
                    console.log(error);
                }
            });
    }

    me() {
        return this.http
            .get<ApiResponse<LoginResponse>>(`${environment.apiUrl}${this.prefix}/me`, {
                withCredentials: true
            })
            .pipe(
                tap(({ data }) => {
                    this.user.set(data.user);
                }),
                catchError(() => {
                    this.user.set(null);
                    return [];
                })
            );
    }
}
