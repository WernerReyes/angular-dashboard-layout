import { ApiResponse } from '@/shared/interfaces/api-response';
import { type MachineEntity, mapMachineEntityToMachine } from '@/shared/mappers/machine.mapper';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateMachine } from '../interfaces/machine';
import { TransformUtils } from '@/utils/transform-utils';
import { CategoryService } from './category.service';

@Injectable({
    providedIn: 'root'
})
export class MachineService {
    private readonly categoryService = inject(CategoryService);
    private readonly http = inject(HttpClient);

    private readonly prefix = `${environment.apiUrl}/machine`;

    loading = signal<boolean>(false);

    createMachine(payload: CreateMachine) {
        this.loading.set(true);

        const formData = TransformUtils.toFormData(payload);

        return this.http.post<ApiResponse<MachineEntity>>(this.prefix, formData).pipe(
            map(({ data }) => mapMachineEntityToMachine(data)),
            tap((machine) => {
                this.categoryService.categoryListResource.update((categories) => {
                    if (!categories) return [];
                    return categories.map((category) => {
                        if (category.id === payload.categoryId) {
                            return {
                                ...category,
                                machines: category.machines ? [...category.machines, machine] : [machine]
                            };
                        }
                        return category;
                    });
                });
            }),
            finalize(() => this.loading.set(false))
        );
    }
}
