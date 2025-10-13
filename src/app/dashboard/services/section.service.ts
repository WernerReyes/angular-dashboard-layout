import type { ApiResponse } from '@/shared/interfaces/api-response';
import { Section } from '@/shared/interfaces/section';
import { mapSectionEntityToSection, SectionEntity } from '@/shared/mappers/section.mapper';
import { MessageService } from '@/shared/services/message.service';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateSection, UpdateSection } from '../interfaces/section';
import { catchError, map, tap, throwError } from 'rxjs';
import { UpdateOrder } from '../interfaces/common';

@Injectable({
    providedIn: 'root'
})
export class SectionService {
    private readonly messageService = inject(MessageService);
    private readonly http = inject(HttpClient);
    private readonly prefix = `${environment.apiUrl}/section`;

    sectionListResource = httpResource<Section[]>(
        () => ({
            url: this.prefix,
            method: 'GET',
            cache: 'reload',
            withCredentials: true
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
        const formData = new FormData();

        Object.entries(section).forEach(([key, value]) => {
            if (value === null || value === undefined) return;

            if (Array.isArray(value)) {
                // ✅ Enviar cada valor del array con sufijo []
                value.forEach((v) => {
                    formData.append(`${key}[]`, v.toString());
                });
            } else {
                formData.append(key, value as string | Blob);
            }
        });

        return this.http.post<ApiResponse<SectionEntity>>(this.prefix, formData, { withCredentials: true }).pipe(
            map(({ message, data }) => ({
                section: mapSectionEntityToSection(data),
                message
            })),
            tap(({ section, message }) => {
                this.messageService.setSuccess(message);
                this.sectionListResource.update((sections) => {
                    if (!sections) return [section];
                    return [...sections, section];
                });
            }),
            catchError((error) => {
                this.messageService.setError(error?.error?.message);
                return throwError(() => error);
            })
        );
    }

    updateSection(id: number, section: UpdateSection) {
        const formData = new FormData();

        Object.entries(section).forEach(([key, value]) => {
            if (value === null || value === undefined) return;

            if (Array.isArray(value)) {
                // ✅ Enviar cada valor del array con sufijo []
                value.forEach((v) => {
                    formData.append(`${key}[]`, v.toString());
                });
            } else {
                formData.append(key, value as string | Blob);
            }
        });
        return this.http.post<ApiResponse<SectionEntity>>(`${this.prefix}/${id}`, formData, { withCredentials: true }).pipe(
            map(({ message, data }) => ({
                section: mapSectionEntityToSection(data),
                message
            })),
            tap(({ section, message }) => {
                this.messageService.setSuccess(message);
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
            }),
            catchError((error) => {
                if (error.error?.code === 422) {
                    const details = error.error?.details;
                    const array = Object.values(details).flat() as string[];
                    this.messageService.setError(array[0]);
                    return throwError(() => error);
                }
                this.messageService.setError(error?.error?.message);
                return throwError(() => error);
            })
        );
    }

    updateSectionsOrder(order: UpdateOrder) {
        return this.http.put<ApiResponse<null>>(`${this.prefix}/order`, order, { withCredentials: true }).pipe(
            tap(({ message }) => {
                this.messageService.setSuccess(message);
                // this.sectionListResource.refresh();
            }),
            catchError((error) => {
                this.messageService.setError(error?.error?.message);
                return throwError(() => error);
            })
        );
    }

    deleteSection(id: number) {
        return this.http.delete<ApiResponse<null>>(`${this.prefix}/${id}`).pipe(
            tap(({ message }) => {
                this.messageService.setSuccess(message);
                this.sectionListResource.update((sections) => sections?.filter((s) => s.id !== id) || []);
            }),
            catchError((error) => {
                this.messageService.setError(error?.error?.message);
                return throwError(() => error);
            })
        );
    }
}
