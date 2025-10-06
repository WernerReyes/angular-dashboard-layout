import { type ApiResponse } from '@/shared/interfaces/api-response';
import type { Menu } from '@/shared/interfaces/menu';
import { mapMenuEntityToMenu, type MenuEntity } from '@/shared/mappers/menu.mapper';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import type { CreateMenu, MenuTypes, UpdateMenuOrder } from '../interfaces/menu';
import { MessageService } from '@/shared/services/message.service';
import { MenuUtils } from '../utils/menu.utils';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private readonly http = inject(HttpClient);
    private readonly messageService = inject(MessageService);

    private readonly prefix = `${environment.apiUrl}/menu`;


    menuList = signal<Menu[]>([]);

    menuCreated = signal<Menu | null>(null);

    currentMenu = signal<Menu | null>(null);

    errorMessage = signal<string | null>(null);
    successMessage = signal<string | null>(null);

    menuListResource = httpResource<Menu[]>(
        () => ({
            url: this.prefix,
            method: 'GET',
            cache: 'reload',
            withCredentials: true
        }),
        {
            parse: (value) => {
                const data = value as ApiResponse<MenuEntity[]>;
                return data.data.map((entity) => mapMenuEntityToMenu(entity));
            }
        }
    );

    getAllCount() {
        return this.http
            .get<ApiResponse<number>>(`${this.prefix}/count`, {
                withCredentials: true
            })
            .pipe(map(({ data }) => data));
    }

    createMenu(create: CreateMenu) {
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
                    this.messageService.setSuccess(message);

                    this.menuListResource.update((menus) => {
                        if (!menus) return [menu];

                        return MenuUtils.insertMenuItem(menus, menu);
                    });
                }),
                catchError((error) => {
                    this.messageService.setError(error.error?.message);

                    return throwError(() => error);
                })
            );
    }

    updateMenu(id: number, update: Partial<CreateMenu>) {
        return this.http
            .put<ApiResponse<MenuEntity>>(`${this.prefix}/${id}`, update, {
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
                    this.menuListResource.update((menus) => {
                        if (!menus) return [];
                        return MenuUtils.updateNestedMenu(menus, menu);
                    });

                    this.messageService.setSuccess(message);
                }),
                catchError((error) => {
                    // this.currentMenu.set(null);
                    this.messageService.setError(error.error?.message);
                    return throwError(() => error);
                })
            );
    }

    updateOrder(menus: UpdateMenuOrder[]) {
        return this.http.put<ApiResponse<void>>(`${this.prefix}/order`, { menuOrderArray: menus }, { withCredentials: true }).pipe(
            tap(({ message }) => {
                this.messageService.setSuccess(message);
            }),
            catchError((error) => {
                this.messageService.setError(error.error?.message);
                return throwError(() => error);
            })
        );
    }

    deleteMenu(id: number, type: MenuTypes) {
        return this.http
            .delete<ApiResponse<null>>(`${this.prefix}/${id}`, {
                withCredentials: true,
                params: { type }
            })
            .pipe(
                tap(() => {
                    this.menuList.update((menus) => menus.filter((m) => m.id !== id));
                    // this.successMessage.set('Menu deleted successfully');
                }),
                catchError((error) => {
                    this.errorMessage.set(error.error?.message);
                    return throwError(() => error);
                })
            );
    }
}
