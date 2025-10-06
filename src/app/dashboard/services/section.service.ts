import type { ApiResponse } from '@/shared/interfaces/api-response';
import { Section } from '@/shared/interfaces/section';
import { mapSectionEntityToSection, SectionEntity } from '@/shared/mappers/section.mapper';
import { MessageService } from '@/shared/services/message.service';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateSection } from '../interfaces/section';
import { catchError, map, tap } from 'rxjs';

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
        return this.http.post<ApiResponse<SectionEntity>>(this.prefix, section, { withCredentials: true }).pipe(
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
                throw error;
            })
        );
    }

    updateSection(id: number, section: Partial<CreateSection>) {
        return this.http.put<ApiResponse<SectionEntity>>(`${this.prefix}/${id}`, section, { withCredentials: true }).pipe(
            map(({ message, data }) => ({
                section: mapSectionEntityToSection(data),
                message
            })),
            tap(({ section, message }) => {
                this.messageService.setSuccess(message);
                this.sectionListResource.update((sections) => {
                    if (!sections) return [section];
                    return sections.map((s) => (s.id === section.id ? section : s));
                });
            }),
            catchError((error) => {
                this.messageService.setError(error?.error?.message);
                throw error;
            })
        );
    }
}
