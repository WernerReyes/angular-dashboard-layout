import type { ApiResponse } from '@/shared/interfaces/api-response';
import { TransformUtils } from '@/utils/transform-utils';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { mapSectionItemEntityToSectionItem, SectionItemEntity } from '../../shared/mappers/section-item.mapper';
import { CreateSectionItem, UpdateSectionItem } from '../interfaces/section-item';
import { SectionUtils } from '../utils/section.utils';
import { SectionService } from './section.service';

@Injectable({
    providedIn: 'root'
})
export class SectionItemService {
    private readonly sectionService = inject(SectionService);

    private readonly http = inject(HttpClient);
    private readonly prefix = `${environment.apiUrl}/section-item`;

    createSectionItem(sectionItem: CreateSectionItem) {
        const formData = TransformUtils.toFormData(sectionItem);
        // Object.entries(sectionItem).forEach(([key, value]) => {
        //     if (value !== null && value !== undefined) {
        //         formData.append(key, value as string | Blob);
        //     }
        // });

        return this.http.post<ApiResponse<SectionItemEntity>>(this.prefix, formData).pipe(
            map(({ data }) => mapSectionItemEntityToSectionItem(data)),
            tap((sectionItem) => {
                this.sectionService.sectionListResource.update((sections) => {
                    return SectionUtils.insertSectionItemInSectionList(sections, sectionItem);
                });
            })
        );
    }

    updateSection(id: number, section: UpdateSectionItem) {
        const formData = TransformUtils.toFormData(section);
        // Object.entries(section).forEach(([key, value]) => {
        //     if (value !== null && value !== undefined) {
        //         formData.append(key, value as string | Blob);
        //     }
        // });
        return this.http.post<ApiResponse<SectionItemEntity>>(`${this.prefix}/${id}`, formData).pipe(
            map(({ data }) => mapSectionItemEntityToSectionItem(data)),
            tap((sectionItem) => {
                // this.messageService.setSuccess(message);
                this.sectionService.sectionListResource.update((sections) => {
                    if (!sections) return [];
                    return SectionUtils.updateSectionItemInSectionList(sections, sectionItem);
                });
            }),
            
        );
    }

    delete(id: number, sectionId: number) {
        return this.http.delete<ApiResponse<void>>(`${this.prefix}/${id}`).pipe(
            tap(() => {
                this.sectionService.sectionListResource.update((sections) => {
                    if (!sections) return [];
                    return SectionUtils.removeSectionItemFromSectionList(sections, id, sectionId);
                });
            })
        );
    }
}
