import type { ApiResponse } from '@/shared/interfaces/api-response';
import { MessageService } from '@/shared/services/message.service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { mapSectionItemEntityToSectionItem, SectionItemEntity } from '../../shared/mappers/section-item.mapper';
import { CreateSectionItem, UpdateSectionItem } from '../interfaces/section-item';
import { SectionService } from './section.service';
import { SectionUtils } from '../utils/section.utils';

@Injectable({
    providedIn: 'root'
})
export class SectionItemService {
    private readonly messageService = inject(MessageService);
    private readonly sectionService = inject(SectionService);

    private readonly http = inject(HttpClient);
    private readonly prefix = `${environment.apiUrl}/section-item`;

    createSectionItem(sectionItem: CreateSectionItem) {
        const formData = new FormData();
        Object.entries(sectionItem).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value as string | Blob);
            }
        });
        return this.http.post<ApiResponse<SectionItemEntity>>(this.prefix, formData, { withCredentials: true }).pipe(
            map(({ message, data }) => ({
                sectionItem: mapSectionItemEntityToSectionItem(data),
                message
            })),
            tap(({ sectionItem, message }) => {
                this.messageService.setSuccess(message);
                this.sectionService.sectionListResource.update((sections) => {
                    return SectionUtils.insertSectionItemInSectionList(sections, sectionItem);
                });
            }),
            catchError((error) => {
                if (error.error?.code === 422) {
                    const details = error.error?.details;
                    const array = Object.values(details).flat() as string[];
                    this.messageService.setError(array[0]);
                    return throwError(() => error);
                }
                console.log('Error creating section item:', error);
                this.messageService.setError(error?.error?.message);
                return throwError(() => error);
            })
        );
    }

    updateSection(id: number, section: UpdateSectionItem) {
        const formData = new FormData();
        Object.entries(section).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value as string | Blob);
            }
        });
        return this.http.post<ApiResponse<SectionItemEntity>>(`${this.prefix}/${id}`, formData, { withCredentials: true }).pipe(
            map(({ message, data }) => ({
                sectionItem: mapSectionItemEntityToSectionItem(data),
                message
            })),
            tap(({ sectionItem, message }) => {
                this.messageService.setSuccess(message);
                this.sectionService.sectionListResource.update((sections) => {
                    if (!sections) return [];
                    return SectionUtils.updateSectionItemInSectionList(sections, sectionItem);
                });
            }),
            catchError((error) => {
                console.log('Error updating section item:', error);
                this.messageService.setError(error?.error?.message);
                return throwError(() => error);
            })
        );
    }

    delete(id: number, sectionId: number) {
        return this.http.delete<ApiResponse<void>>(`${this.prefix}/${id}`, { withCredentials: true }).pipe(
            tap(({ message }) => {
                this.messageService.setSuccess(message);
                this.sectionService.sectionListResource.update((sections) => {
                    if (!sections) return [];
                    return SectionUtils.removeSectionItemFromSectionList(sections, id, sectionId);
                });
            })
        );
    }
}
