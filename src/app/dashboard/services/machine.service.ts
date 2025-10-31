import { ApiResponse } from '@/shared/interfaces/api-response';
import { type MachineEntity, mapMachineEntityToMachine } from '@/shared/mappers/machine.mapper';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateMachine, UpdateMachine } from '../interfaces/machine';
import { TransformUtils } from '@/utils/transform-utils';
import { CategoryService } from './category.service';
import type { Machine } from '@/shared/interfaces/machine';

@Injectable({
    providedIn: 'root'
})
export class MachineService {
    private readonly categoryService = inject(CategoryService);
    private readonly http = inject(HttpClient);

    private readonly prefix = `${environment.apiUrl}/machine`;

    loading = signal<boolean>(false);

    machinesListRs = httpResource<Machine[]>(
        () => ({
            url: this.prefix,
            method: 'GET',
            cache: 'reload'
        }),
        {
            parse: (value) => {
                const data = value as ApiResponse<MachineEntity[]>;
                return data.data.map((entity) => mapMachineEntityToMachine(entity));
            }
        }
    );

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

    updateMachine(payload: UpdateMachine) {
        this.loading.set(true);

        const { imagesToUpdate, ...rest } = payload;

        //* Update
        const imagesToUpdateNew = imagesToUpdate?.map((img) => img.newFile) || null;
        const imagesToUpdateOld = imagesToUpdate?.map((img) => img.oldImage) || null;

        console.log({
            imagesToUpdateNew,
            imagesToUpdateOld
        });

        //* Delete
        // const imagesToRemove = imagesToDelete?.map((img) => img.delete) || [];
        // const imagesToDeleteNew = (imagesToDelete?.map((img) => img.newFile).filter((file) => file) as File[]) || [];

        const formData = TransformUtils.toFormData({
            ...rest,
            imagesToUpdateNew,
            imagesToUpdateOld
            // imagesToRemove: imagesToDelete || [],
            // imagesToDeleteNew
        });

        return this.http.post<ApiResponse<MachineEntity>>(`${this.prefix}/${payload.id}`, formData).pipe(
            map(({ data }) => mapMachineEntityToMachine(data)),
            tap((updatedMachine) => {
                this.categoryService.categoryListResource.update((categories) => {
                    if (!categories) return [];
                    return categories.map((category) => {
                        if (category.id === updatedMachine.categoryId) {
                            return {
                                ...category,
                                machines: category.machines ? category.machines.map((machine) => (machine.id === updatedMachine.id ? updatedMachine : machine)) : [updatedMachine]
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
