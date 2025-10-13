import type { User } from '@/shared/interfaces/user';
import { mapUserEntityToUser } from '@/shared/mappers/user.mapper';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response';
import type { LoginRequest, LoginResponse } from '../interfaces/login';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly prefix = '/auth';

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
            .post<ApiResponse<LoginResponse>>(`${environment.apiUrl}${this.prefix}/login`, loginRequest, {
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

    relogin() {
        return this.http
            .post<ApiResponse<LoginResponse>>(`${environment.apiUrl}${this.prefix}/relogin`, null, {
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
            .get<ApiResponse<LoginResponse>>(`${environment.apiUrl}${this.prefix}/me`, {
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
            .post(`${environment.apiUrl}${this.prefix}/logout`, null, {
                withCredentials: true
            })
            .pipe(
                tap(() => {
                    this.user.set(null);
                    this._authStatus.set('not-authenticated');
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
