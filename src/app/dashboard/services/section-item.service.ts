import type { ApiResponse } from '@/shared/interfaces/api-response';
import { TransformUtils } from '@/utils/transform-utils';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize, map, tap } from 'rxjs';
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


    loading = signal<boolean>(false);

    createSectionItem(sectionItem: CreateSectionItem) {
        this.loading.set(true);

        const formData = TransformUtils.toFormData(sectionItem);
        

        return this.http.post<ApiResponse<SectionItemEntity>>(this.prefix, formData).pipe(
            map(({ data }) => mapSectionItemEntityToSectionItem(data)),
            tap((sectionItem) => {
                this.sectionService.sectionListResource.update((sections) => {
                    if (!sections) return [];
                    return SectionUtils.insertSectionItemInSectionList(sections, sectionItem);
                });

               
            }),
            finalize(() => this.loading.set(false))
        );
    }

    updateSection(id: number, section: UpdateSectionItem) {
        this.loading.set(true);

        const formData = TransformUtils.toFormData(section);
       
        return this.http.post<ApiResponse<SectionItemEntity>>(`${this.prefix}/${id}`, formData).pipe(
            map(({ data }) => mapSectionItemEntityToSectionItem(data)),
            tap((sectionItem) => {
               
                this.sectionService.sectionListResource.update((sections) => {
                    if (!sections) return [];
                    return SectionUtils.updateSectionItemInSectionList(sections, sectionItem);
                });

               
            }),
            finalize(() => this.loading.set(false))
            
        );
    }

    duplicate(id: number) {
        this.loading.set(true);
        return this.http.post<ApiResponse<SectionItemEntity>>(`${this.prefix}/${id}/duplicate`, {}).pipe(
            map(({ data }) => mapSectionItemEntityToSectionItem(data)),
            tap((sectionItem) => {
                this.sectionService.sectionListResource.update((sections) => {
                    if (!sections) return [];
                    return SectionUtils.insertSectionItemInSectionList(sections, sectionItem);
                });
            }),
            finalize(() => this.loading.set(false))
        );
    }

    delete(id: number, sectionId: number) {
        this.loading.set(true);
        return this.http.delete<ApiResponse<void>>(`${this.prefix}/${id}`).pipe(
            tap(() => {
                this.sectionService.sectionListResource.update((sections) => {
                    if (!sections) return [];
                    return SectionUtils.removeSectionItemFromSectionList(sections, id, sectionId);
                });

               
            }),
            finalize(() => this.loading.set(false))
        );
    }
}
