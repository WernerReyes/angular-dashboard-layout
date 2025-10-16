import type { ApiResponse } from '@/shared/interfaces/api-response';
import { Section } from '@/shared/interfaces/section';
import { mapSectionEntityToSection, SectionEntity } from '@/shared/mappers/section.mapper';
import { TransformUtils } from '@/utils/transform-utils';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UpdateOrder } from '../interfaces/common';
import { CreateSection, UpdateSection } from '../interfaces/section';

@Injectable({
    providedIn: 'root'
})
export class SectionService {
    private readonly http = inject(HttpClient);
    private readonly prefix = `${environment.apiUrl}/section`;

    isCreating = signal(false);
    isUpdating = signal(false);

    sectionListResource = httpResource<Section[]>(
        () => ({
            url: this.prefix,
            method: 'GET',
            cache: 'reload'
        }),
        {
            parse: (value) => {
                const data = value as ApiResponse<SectionEntity[]>;
                return data.data.map(mapSectionEntityToSection);
            },
            defaultValue: []
        }
    );

    createSection(section: CreateSection) {
        const formData = TransformUtils.toFormData(section);
        this.isCreating.set(true);

        return this.http.post<ApiResponse<SectionEntity>>(this.prefix, formData).pipe(
            map(({ data }) => mapSectionEntityToSection(data)),
            tap((section) => {
                this.sectionListResource.update((sections) => {
                    if (!sections) return [section];
                    return [...sections, section];
                });
                this.isCreating.set(false);
            }),
            catchError((error) => {
                this.isCreating.set(false);
                return throwError(() => error);
            })

        );
    }

    updateSection(id: number, section: UpdateSection) {
        const formData = TransformUtils.toFormData(section);
        this.isUpdating.set(true);

        // Object.entries(section).forEach(([key, value]) => {
        //     if (value === null || value === undefined) return;

        //     if (Array.isArray(value)) {
        //         // ✅ Enviar cada valor del array con sufijo []
        //         value.forEach((v) => {
        //             formData.append(`${key}[]`, v.toString());
        //         });
        //     } else {
        //         formData.append(key, value as string | Blob);
        //     }
        // });
        return this.http.post<ApiResponse<SectionEntity>>(`${this.prefix}/${id}`, formData).pipe(
            map(({ data }) => mapSectionEntityToSection(data)),
            tap((section) => {
                this.sectionListResource.update((sections) => {
                    if (!sections) return [section];
                    return sections.map((s) =>
                        s.id === section.id
                            ? {
                                  ...section,
                                  items: s.items
                              }
                            : s
                    );
                });
                this.isUpdating.set(false);
            }),
            catchError((error) => {
                this.isUpdating.set(false);
                return throwError(() => error);
            })
        );
    }

    updateSectionsOrder(order: UpdateOrder) {
        return this.http.put<ApiResponse<null>>(`${this.prefix}/order`, order);
    }

    deleteSection(id: number) {
        return this.http.delete<ApiResponse<null>>(`${this.prefix}/${id}`).pipe(
            tap(() => {
                this.sectionListResource.update((sections) => sections?.filter((s) => s.id !== id) || []);
            })
        );
    }
}
