import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import type { CreateMenu } from '../interfaces/menu';
import type { Menu } from '@/shared/interfaces/menu';
import { catchError, tap, throwError } from 'rxjs';
import { ApiResponse } from '@/shared/interfaces/api-response';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private readonly http = inject(HttpClient);

    private readonly prefix = `${environment.apiUrl}/menu`;

    menuCreated = signal<Menu | null>(null);

    errorMessage = signal<string | null>(null);
    successMessage = signal<string | null>(null);

    createMenu(create: CreateMenu) {
        console.log('Creating menu with data:', create);
        return this.http
            .post<ApiResponse<Menu>>(`${this.prefix}`, create, {
                withCredentials: true
            })
            .pipe(
                tap(({ data }) => {
                    this.menuCreated.set(data);
                    this.successMessage.set('Menu creado exitosamente');
                }),
                catchError(({ error }) => {
                    this.errorMessage.set(error.message);
                    return throwError(() => error);
                })
            )
            
    }
}
