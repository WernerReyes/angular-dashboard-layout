import type { User } from '@/shared/interfaces/user';
import { mapUserEntityToUser, UserEntity } from '@/shared/mappers/user.mapper';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response';
import type { LoginRequest, LoginResponse } from '../interfaces/login';
import { UpdatePassword, UpdateProfile } from '../interfaces/user';
import { TransformUtils } from '@/utils/transform-utils';
import { MessageService } from '@/shared/services/message.service';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly messageService = inject(MessageService);
    private readonly prefix = `${environment.apiUrl}/auth`;

    private _authStatus = signal<AuthStatus>('checking');
    authStatus = computed<AuthStatus>(() => {
        if (this._authStatus() === 'checking') return 'checking';

        if (this.user()) {
            return 'authenticated';
        }

        return 'not-authenticated';
    });

    user = signal<User | null>(null);
    token = signal<string | null>(null);

    isAuthenticated = computed(() => {
        return !!this.user;
    });

    constructor() {
        window.addEventListener('storage', (event) => {
            if (event.key === 'session_refresh') {
                this.me().subscribe();
            }
        });
    }

    login(loginRequest: LoginRequest) {
        return this.http
            .post<ApiResponse<LoginResponse>>(`${this.prefix}/login`, loginRequest, {
                withCredentials: true
            })
            .pipe(
                map(({ data }) => ({
                    user: mapUserEntityToUser(data.user),
                    token: data.accessToken
                })),
                tap((res) => this.handleAuthSuccess(res.user, res.token)),
                catchError((error) => {
                    console.error('Login error:', error.error);
                    this.messageService.setError(error.error?.message || 'Ocurrio un error al iniciar sesión');
                    return this.handleAuthError(error);
                })
            );
    }

    relogin() {
        return this.http
            .post<ApiResponse<LoginResponse>>(`${this.prefix}/relogin`, null, {
                withCredentials: true
            })
            .pipe(
                map(({ data }) => ({
                    user: mapUserEntityToUser(data.user),
                    token: data.accessToken
                })),
                tap((res) => {
                    this.handleAuthSuccess(res.user, res.token);
                }),
                catchError((error) => this.handleAuthError(error))
            );
    }

    me() {
        return this.http
            .get<ApiResponse<LoginResponse>>(`${this.prefix}/me`, {
                withCredentials: true
            })
            .pipe(
                map(({ data }) => ({
                    user: mapUserEntityToUser(data.user),
                    token: data.accessToken
                })),
                tap((res) => this.handleAuthSuccess(res.user, res.token)),
                catchError((error) => this.handleAuthError(error))
            );
    }

    logout() {
        // this.userResource.update(() => null);
        return this.http
            .post(`${this.prefix}/logout`, null, {
                withCredentials: true
            })
            .pipe(
                tap(() => {
                    this.user.set(null);
                    this._authStatus.set('not-authenticated');
                })
            );
    }

    updateProfile(update: UpdateProfile) {
        const formData = TransformUtils.toFormData(update);
        return this.http.post<ApiResponse<UserEntity>>(`${this.prefix}/update-profile`, formData).pipe(
            map(({ data, message }) => ({
                user: mapUserEntityToUser(data),
                message
            })),
            tap(({ user, message }) => {
                this.user.set(user);
                this.messageService.setSuccess(message);
            }),
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }

    updatePassword(update: UpdatePassword) {
        return this.http.put<ApiResponse<null>>(`${this.prefix}/update-password`, update).pipe(
            map(({ message }) => message),
            tap((message) => {
                this.messageService.setSuccess(message);
            }),
            catchError((error) => {
                this.messageService.setError(error.error?.message || 'Ocurrio un error al editar la contraseña');
                return throwError(() => error);
            })
        );
    }

    private handleAuthSuccess(user: User, token: string): boolean {
        // this.userResource.update(() => user);
        this._authStatus.set('authenticated');
        this.user.set(user);
        this.token.set(token);
        return true;
    }

    private handleAuthError(error: any) {
        console.error('Auth error:', error);
        this.logout();
        return of(false);
    }
}
