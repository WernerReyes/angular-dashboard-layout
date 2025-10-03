import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import type { CreateMenu, MenuTypes } from '../interfaces/menu';
import type { Menu } from '@/shared/interfaces/menu';
import { catchError, firstValueFrom, map, tap, throwError } from 'rxjs';
import { type ApiResponse } from '@/shared/interfaces/api-response';
import { mapMenuEntityToMenu, type MenuEntity } from '@/shared/mappers/menu.mapper';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private readonly http = inject(HttpClient);

    private readonly prefix = `${environment.apiUrl}/menu`;

    // menuListResource = resource({
    //     loader: async () => await firstValueFrom(this.getAll().pipe(map(() => this.menuList()))),
        
    // });

    constructor() {
        this.getAll().subscribe();
    }

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
                return data.data.map(mapMenuEntityToMenu);
            }
        }
    );


    getAll() {
        return this.http
            .get<ApiResponse<MenuEntity[]>>(this.prefix, {
                withCredentials: true
            })
            .pipe(
                map(({ data, ...rest }) => {
                    return {
                        menus: data.map(mapMenuEntityToMenu),
                        ...rest
                    };
                }),
                tap(({ menus }) => this.menuList.set(menus)),
                catchError((error) => {
                    console.log(error)
                    // this.errorMessage.set(error.error?.message);
                    return throwError(() => "Error fetching menus");
                })
            );
    }

    getAllCount() {
        return this.http
            .get<ApiResponse<number>>(`${this.prefix}/count`, {
                withCredentials: true
            })
            .pipe(map(({ data }) => data));
    }

    getById(id: number) {
        return this.http
            .get<ApiResponse<MenuEntity>>(`${this.prefix}/${id}`, {
                withCredentials: true
            })
            .pipe(
                map(({ data }) => {
                    return mapMenuEntityToMenu(data);
                }),
                tap((menu) => this.currentMenu.set(menu))
            );
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
                    this.menuCreated.set(menu);
                    this.menuList.update((menus) => [...menus, menu].sort((a, b) => a.order - b.order));
                    this.successMessage.set(message);
                }),
                catchError((error) => {
                    this.menuCreated.set(null);
                    this.errorMessage.set(error.error?.message);
                    return throwError(() => error);
                })
            );
    }

    updateMenu(id: number, update: CreateMenu) {
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
                    // this.currentMenu.set(menu);
                    this.menuList.update((menus) => {
                        const index = menus.findIndex((m) => m.id === menu.id);
                        if (index !== -1) {
                            menus[index] = menu;
                        }
                        return menus;
                    });
                    this.successMessage.set(message);
                }),
                catchError((error) => {
                    // this.currentMenu.set(null);
                    this.errorMessage.set(error.error?.message);
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
