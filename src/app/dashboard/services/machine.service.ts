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
import { SectionService } from './section.service';

@Injectable({
    providedIn: 'root'
})
export class MachineService {
    private readonly sectionService = inject(SectionService);
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
                this.machinesListRs.update((machines) => {
                    if (!machines) return [machine];
                    return [...machines, machine];
                });

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

        const formData = TransformUtils.toFormData({
            ...rest,
            imagesToUpdateNew,
            imagesToUpdateOld
        });

        return this.http.post<ApiResponse<MachineEntity>>(`${this.prefix}/${payload.id}`, formData).pipe(
            map(({ data }) => mapMachineEntityToMachine(data)),
            tap((updatedMachine) => {
                this.machinesListRs.update((machines) => {
                    if (!machines) return [];
                    return machines.map((machine) => (machine.id === updatedMachine.id ? updatedMachine : machine));
                });

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

                this.sectionService.sectionListResource.update((sections) => {
                    if (!sections) return [];
                    return sections.map((section) => {
                        if (updatedMachine.sections?.some((s) => s.id === section.id)) {
                            return {
                                ...section,
                                machines: section.machines ? section.machines.map((machine) => (machine.id === updatedMachine.id ? updatedMachine : machine)) : [updatedMachine]
                            };
                        }
                        return section;
                    });
                });
            }),
            finalize(() => this.loading.set(false))
        );
    }

    setImageAsMain(machineId: number, imageUrl: string) {
        this.loading.set(true);
        return this.http.put<ApiResponse<null>>(`${this.prefix}/${machineId}/set-main-image`, { imageUrl }).pipe(
            tap(() => {
                this.machinesListRs.update((machines) => {
                    if (!machines) return [];
                    return machines.map((machine) => (machine.id === machineId ? { ...machine, images: machine.images?.map((img) => ({ ...img, isMain: img.url === imageUrl })) || [] } : machine));
                });

                this.categoryService.categoryListResource.update((categories) => {
                    if (!categories) return [];
                    return categories.map((category) => {
                        return {
                            ...category,
                            machines: category.machines
                                ? category.machines.map((machine) =>
                                      machine.id === machineId ? { ...machine, images: machine.images?.map((img) => ({ ...img, isMain: img.url === imageUrl })) || [] } : machine
                                  )
                                : []
                        };
                    });
                });


                this.sectionService.sectionListResource.update((sections) => {
                    if (!sections) return [];

                    return sections.map((section) => {
                        return {
                            ...section,
                            machines: section.machines
                                ? section.machines.map((machine) =>
                                      machine.id === machineId ? { ...machine, images: machine.images?.map((img) => ({ ...img, isMain: img.url === imageUrl })) || [] } : machine
                                  )
                                : []
                        };
                    });
                });

            }),
            finalize(() => this.loading.set(false))
        );
    }

    deleteMachine(machineId: number) {
        this.loading.set(true);

        return this.http.delete<ApiResponse<null>>(`${this.prefix}/${machineId}`).pipe(
            tap(() => {
                this.machinesListRs.update((machines) => {
                    if (!machines) return [];
                    return machines.filter((machine) => machine.id !== machineId);
                });

                this.categoryService.categoryListResource.update((categories) => {
                    if (!categories) return [];
                    return categories.map((category) => {
                        return {
                            ...category,
                            machines: category.machines ? category.machines.filter((machine) => machine.id !== machineId) : []
                        };
                    });
                });
            }),
            finalize(() => this.loading.set(false))
        );
    }
}
