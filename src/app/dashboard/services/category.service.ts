import type { ApiResponse } from '@/shared/interfaces/api-response';
import { type Category } from '@/shared/interfaces/category';
import { type CategoryEntity, mapCategoryEntityToCategory } from '@/shared/mappers/category.mapper';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateCategory } from '../interfaces/category';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly http = inject(HttpClient);
   
    private readonly prefix = `${environment.apiUrl}/category`;


    loading = signal<boolean>(false);

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

    createCategory(payload: CreateCategory) {
        this.loading.set(true);
        return this.http.post<ApiResponse<CategoryEntity>>(this.prefix, payload).pipe(
            map((res) => mapCategoryEntityToCategory(res.data)),
            tap((category) => {
                this.categoryListResource.update((categories) => {
                    if (!categories) return [category];
                    return [...categories, category];
                });
                this.loading.set(false);
            })
        );
    }

    updateCategory(id: number, payload: Partial<CreateCategory>) {
        this.loading.set(true);
        return this.http.put<ApiResponse<CategoryEntity>>(`${this.prefix}/${id}`, payload).pipe(
            map((res) => mapCategoryEntityToCategory(res.data)),
            tap((category) => {
                this.categoryListResource.update((categories) => {
                    if (!categories) return [category];
                    return categories.map((cat) => (cat.id === category.id ? {
                        ...category,
                        machines: cat.machines
                    } : cat));
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
