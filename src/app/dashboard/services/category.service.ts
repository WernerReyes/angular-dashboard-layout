import { type Category } from '@/shared/interfaces/category';
import { type CategoryEntity, mapCategoryEntityToCategory } from '@/shared/mappers/category.mapper';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import type { ApiResponse } from '@/shared/interfaces/api-response';
import { catchError, map, tap, throwError } from 'rxjs';
import { MessageService } from '@/shared/services/message.service';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly http = inject(HttpClient);
    private readonly messageService = inject(MessageService);

    private readonly prefix = `${environment.apiUrl}/category`;

    categoryListResource = httpResource<Category[]>(
        () => ({
            url: this.prefix,
            method: 'GET',
            cache: 'reload',
            withCredentials: true
        }),
        {
            parse: (value) => {
                const data = value as ApiResponse<CategoryEntity[]>;
                return data.data.map(mapCategoryEntityToCategory);
            }
        }
    );

    createCategory(title: string) {
        return this.http.post<ApiResponse<CategoryEntity>>(this.prefix, { title }, { withCredentials: true }).pipe(
            map((res) => ({
                category: mapCategoryEntityToCategory(res.data),
                message: res.message
            })),
            tap(({ category, message }) => {
                this.messageService.setSuccess(message);
                this.categoryListResource.update((categories) => {
                    if (!categories) return [category];
                    return [...categories, category];
                });
            }),
            catchError((error) => {
                this.messageService.setError(error.error.message);
                return throwError(() => error);
            })
        );
    }

    updateCategory(id: number, title: string) {
        return this.http.put<ApiResponse<CategoryEntity>>(`${this.prefix}/${id}`, { title }, { withCredentials: true }).pipe(
            map((res) => ({
                category: mapCategoryEntityToCategory(res.data),
                message: res.message
            })),
            tap(({ category, message }) => {
                this.messageService.setSuccess(message);
                this.categoryListResource.update((categories) => {
                    if (!categories) return [category];
                    return categories.map((cat) => (cat.id === category.id ? category : cat));
                });
            }),
            catchError((error) => {
                this.messageService.setError(error.error.message);
                return throwError(() => error);
            })
        );
    }
}
