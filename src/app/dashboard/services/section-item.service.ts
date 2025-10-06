import type { ApiResponse } from '@/shared/interfaces/api-response';
import { MessageService } from '@/shared/services/message.service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { mapSectionItemEntityToSectionItem, SectionItemEntity } from '../../shared/mappers/section-item.mapper';
import { CreateSectionItem } from '../interfaces/section-title';

@Injectable({
    providedIn: 'root'
})
export class SectionItemService {
    private readonly messageService = inject(MessageService);

    private readonly http = inject(HttpClient);
    private readonly prefix = `${environment.apiUrl}/section-item`;

    createSectionItem(sectionItem: CreateSectionItem) {
        const formData = new FormData();
        Object.entries(sectionItem).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value as string | Blob);
            }
        });
        console.log('formData', formData);
        return this.http.post<ApiResponse<SectionItemEntity>>(this.prefix, formData, { withCredentials: true, 

            // headers: {
            //     // 'Content-Type': 'multipart/form-data' // Let the browser set it automatically
            // }
         }).pipe(
            map(({ message, data }) => ({
                sectionItem: mapSectionItemEntityToSectionItem(data),
                message
            })),
            tap(({ sectionItem, message }) => {
                this.messageService.setSuccess(message);
            }),
            catchError((error) => {
                this.messageService.setError(error?.error?.message);
                throw error;
            })
        );
    }

    updateSection(id: number, section: Partial<CreateSectionItem>) {
        return this.http.put<ApiResponse<SectionItemEntity>>(`${this.prefix}/${id}`, section, { withCredentials: true }).pipe(
            map(({ message, data }) => ({
                sectionItem: mapSectionItemEntityToSectionItem(data),
                message
            })),
            tap(({ sectionItem, message }) => {
                this.messageService.setSuccess(message);
            }),
            catchError((error) => {
                this.messageService.setError(error?.error?.message);
                throw error;
            })
        );
    }
}
