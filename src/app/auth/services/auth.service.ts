import type { User } from '@/shared/interfaces/user';
import { mapUserEntityToUser, UserEntity } from '@/shared/mappers/user.mapper';
import { TransformUtils } from '@/utils/transform-utils';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response';
import type { LoginRequest, LoginResponse } from '../interfaces/login';
import { UpdatePassword, UpdateProfile } from '../interfaces/user';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
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
    loading = signal<boolean>(false);

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
        this.loading.set(true);
        return this.http
            .post<ApiResponse<LoginResponse>>(`${this.prefix}/login`, loginRequest, {
                withCredentials: true
            })
            .pipe(
                map(({ data }) => ({
                    user: mapUserEntityToUser(data.user),
                    token: data.accessToken,
                    refresh: data.refreshToken
                })),
                tap((res) => this.handleAuthSuccess(res.user, res.token)),
                catchError((error) => {
                    return this.handleAuthError(error);
                }),
                finalize(() => this.loading.set(false))
            );
    }

    relogin() {
        this.loading.set(true);
        return this.http
            .post<ApiResponse<LoginResponse>>(`${this.prefix}/relogin`, null, {
                withCredentials: true
            })
            .pipe(
                map(({ data }) => ({
                    user: mapUserEntityToUser(data.user),
                    token: data.accessToken,
                    refresh: data.refreshToken
                })),
                tap((res) => {
                    this.handleAuthSuccess(res.user, res.token);
                }),
                catchError((error) => this.handleAuthError(error)),
                finalize(() => this.loading.set(false))
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
                    token: data.accessToken,
                    refresh: data.refreshToken
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
                    this.token.set(null);
                    localStorage.removeItem('_session_token');
                })
            );
    }

    updateProfile(update: UpdateProfile) {
        this.loading.set(true);
        const formData = TransformUtils.toFormData(update);
        return this.http.post<ApiResponse<UserEntity>>(`${this.prefix}/update-profile`, formData).pipe(
            map(({ data }) => mapUserEntityToUser(data)),
            tap((user) => {
                this.user.set(user);
            }),
            catchError((error) => {
                return throwError(() => error);
            }),
            finalize(() => this.loading.set(false))
        );
    }

    updatePassword(update: UpdatePassword) {
        return this.http.put<ApiResponse<null>>(`${this.prefix}/update-password`, update);
    }

    private handleAuthSuccess(user: User, token: string): boolean {
        // this.userResource.update(() => user);
        localStorage.setItem('_session_token', token);
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
