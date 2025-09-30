import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import type { CreateMenu } from '../interfaces/menu';
import type { Menu } from '@/shared/interfaces/menu';
import { catchError, map, tap, throwError } from 'rxjs';
import { type ApiResponse } from '@/shared/interfaces/api-response';
import { mapMenuEntityToMenu, type MenuEntity } from '@/shared/mappers/menu.mapper';

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
            .post<ApiResponse<MenuEntity>>(`${this.prefix}`, create, {
                withCredentials: true
            })
            .pipe(
                map(({ data, ...rest }) => {
                    return {
                        menu: mapMenuEntityToMenu(data),
                        ...rest
                    };
                }),
                tap(({ menu, message }) => {
                    this.menuCreated.set(menu);
                    this.successMessage.set(message);
                }),
                catchError((error) => {
                    this.menuCreated.set(null);
                    this.errorMessage.set(error.error?.message);
                    return [];
                })
            );
    }
}
