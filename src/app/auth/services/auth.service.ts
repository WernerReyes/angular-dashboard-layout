import { computed, inject, Injectable, signal } from '@angular/core';
import type { LoginRequest, LoginResponse } from '../interfaces/login';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import type { User } from '@/shared/interfaces/user';
import { Router } from '@angular/router';
import { catchError, map, pipe, tap } from 'rxjs';
import { ApiResponse } from '../../shared/interfaces/api-response';
import { mapUserEntityToUser } from '@/shared/mappers/user.mapper';

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
            .pipe(
                map(({ data }) => mapUserEntityToUser(data.user)),
                tap((user) => this.user.set(user)),
                catchError((error) => {
                    this.user.set(null);
                    return [];
                })
            )
            .subscribe({
                next: (response) => {
                    // this.user.set(response.data.user);
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
                map(({ data }) => mapUserEntityToUser(data.user)),
                tap((user) => {
                    this.user.set(user);
                }),
                catchError(() => {
                    this.user.set(null);
                    return [];
                })
            );
    }
}
