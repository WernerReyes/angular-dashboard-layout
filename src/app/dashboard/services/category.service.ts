import type { ApiResponse } from '@/shared/interfaces/api-response';
import { type Category } from '@/shared/interfaces/category';
import { type CategoryEntity, mapCategoryEntityToCategory } from '@/shared/mappers/category.mapper';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly http = inject(HttpClient);
   
    private readonly prefix = `${environment.apiUrl}/category`;

    categoryListResource = httpResource<Category[]>(
        () => ({
            url: this.prefix,
            method: 'GET',
            cache: 'reload'
        }),
        {
            parse: (value) => {
                const data = value as ApiResponse<CategoryEntity[]>;
                return data.data.map(mapCategoryEntityToCategory);
            }
        }
    );

    createCategory(title: string) {
        return this.http.post<ApiResponse<CategoryEntity>>(this.prefix, { title }).pipe(
            map((res) => mapCategoryEntityToCategory(res.data)),
            tap((category) => {
                this.categoryListResource.update((categories) => {
                    if (!categories) return [category];
                    return [...categories, category];
                });
            })
        );
    }

    updateCategory(id: number, title: string) {
        return this.http.put<ApiResponse<CategoryEntity>>(`${this.prefix}/${id}`, { title }).pipe(
            map((res) => mapCategoryEntityToCategory(res.data)),
            tap((category) => {
                this.categoryListResource.update((categories) => {
                    if (!categories) return [category];
                    return categories.map((cat) => (cat.id === category.id ? category : cat));
                });
            })
        );
    }

    deleteCategory(id: number) {
        return this.http.delete<ApiResponse<null>>(`${this.prefix}/${id}`).pipe(
            tap(() => {
                this.categoryListResource.update((categories) => {
                    if (!categories) return [];
                    return categories.filter((cat) => cat.id !== id);
                });
            })
        );
    }
}
