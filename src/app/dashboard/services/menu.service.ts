import { type ApiResponse } from '@/shared/interfaces/api-response';
import type { Menu } from '@/shared/interfaces/menu';
import { mapMenuEntityToMenu, type MenuEntity } from '@/shared/mappers/menu.mapper';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import type { CreateMenu, UpdateMenuOrder } from '../interfaces/menu';
import { MenuUtils } from '../utils/menu.utils';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private readonly http = inject(HttpClient);
    
    private readonly prefix = `${environment.apiUrl}/menu`;

   
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

    createMenu(create: CreateMenu) {
        return this.http
            .post<ApiResponse<MenuEntity>>(`${this.prefix}`, create, {
                withCredentials: true
            })
            .pipe(
                map(({ data }) => mapMenuEntityToMenu(data)),
                tap((menu) => {
                    this.menuListResource.update((menus) => {
                        if (!menus) return [menu];

                        return MenuUtils.insertMenuItem(menus, menu);
                    });
                })
            );
    }

    updateMenu(id: number, update: Partial<CreateMenu>) {
        return this.http
            .put<ApiResponse<MenuEntity>>(`${this.prefix}/${id}`, update, {
                withCredentials: true
            })
            .pipe(
                map(({ data }) => mapMenuEntityToMenu(data)),
                tap((menu) => {
                    this.menuListResource.update((menus) => {
                        if (!menus) return [];
                        return MenuUtils.updateNestedMenu(menus, menu);
                    });
                })
            );
    }

    updateOrder(menus: UpdateMenuOrder[]) {
        return this.http.put<ApiResponse<null>>(`${this.prefix}/order`, { menuOrderArray: menus });
    }

    deleteMenu(id: number, parentId: number | null) {
        return this.http.delete<ApiResponse<null>>(`${this.prefix}/${id}`).pipe(
            tap(() => {
                this.menuListResource.update((menus) => {
                    if (!menus) return [];
                    const newMenus = menus.map((m) => {
                        if (parentId && m.id === parentId) {
                            return {
                                ...m,
                                children: m.children?.filter((child) => child.id !== id) ?? []
                            };
                        }

                        return m;
                    });

                    return parentId ? newMenus : newMenus.filter((m) => m.id !== id);
                });
            })
        );
    }
}
