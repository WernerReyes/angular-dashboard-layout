import { type Category } from '@/shared/interfaces/category';
import { type CategoryEntity, mapCategoryEntityToCategory } from '@/shared/mappers/category.mapper';
import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import type { ApiResponse } from '@/shared/interfaces/api-response';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly prefix = `${environment.apiUrl}/category`;

    categoryListResource = httpResource<Category[]>(
        () => ({
            url: this.prefix,
            method: 'GET',
            cache: 'reload',
            withCredentials: true,
            
        }),
        {
            parse: (value) => {
                const data = value as ApiResponse<CategoryEntity[]>;
                return data.data.map(mapCategoryEntityToCategory);
            }
        }
    );
}
