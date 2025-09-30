import type { User } from '@/shared/interfaces/user';
import { mapUserEntityToUser, UserEntity } from '@/shared/mappers/user.mapper';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response';
import type { LoginRequest, LoginResponse } from '../interfaces/login';

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
            .get<ApiResponse<UserEntity>>(`${environment.apiUrl}${this.prefix}/me`, {
                withCredentials: true
            })
            .pipe(
                map(({ data }) => {
                    
                    return mapUserEntityToUser(data);
                }),
                tap((user) => {
                    this.user.set(user);
                }),

                catchError((error) => {
                    console.log('Error in me():', error);
                    this.user.set(null);
                    return throwError(() => new Error('Not authenticated'));
                })
            );
    }
}
