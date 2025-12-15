import type { ApiResponse } from '@/shared/interfaces/api-response';
import { TransformUtils } from '@/utils/transform-utils';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { mapSectionItemEntityToSectionItem, SectionItemEntity } from '../../shared/mappers/section-item.mapper';
import type { CreateSectionItem, UpdateSectionItem } from '../interfaces/section-item';
import { SectionUtils } from '../utils/section.utils';
import { SectionService } from './section.service';
import { SectionMode } from '@/shared/mappers/section.mapper';
import { PageService } from './page.service';

@Injectable({
    providedIn: 'root'
})
export class SectionItemService {
    private readonly pageService = inject(PageService);
    private readonly sectionService = inject(SectionService);

    private readonly http = inject(HttpClient);
    private readonly prefix = `${environment.apiUrl}/section-item`;

    loading = signal<boolean>(false);

    createSectionItem(sectionItem: CreateSectionItem, mode: SectionMode = SectionMode.CUSTOM) {
        this.loading.set(true);

        const formData = TransformUtils.toFormData(sectionItem);

        return this.http.post<ApiResponse<SectionItemEntity>>(this.prefix, formData).pipe(
            map(({ data }) => mapSectionItemEntityToSectionItem(data)),
            tap((sectionItem) => {
                if (mode === SectionMode.LAYOUT) {
                    this.sectionService.sectionLayoutsListRs.update((sections) => {
                        if (!sections) return [];
                        return SectionUtils.insertSectionItemInSectionList(sections, sectionItem);
                    });
                    return;
                }
                // this.sectionService.sectionListResource.update((sections) => {
                //     if (!sections) return [];
                //     return SectionUtils.insertSectionItemInSectionList(sections, sectionItem);
                // });
                const pageId = this.pageService.pageId();
                this.pageService.pageByIdRs.update((page) => {
                    if (!page) return page;
                    return {
                        ...page,
                        sections: page.id === pageId ? SectionUtils.insertSectionItemInSectionList(page.sections || [], sectionItem) : page.sections
                    };
                });
            }),
            finalize(() => this.loading.set(false))
        );
    }

    updateSection(id: number, section: UpdateSectionItem, mode: SectionMode = SectionMode.CUSTOM) {
        this.loading.set(true);

        const formData = TransformUtils.toFormData(section);

        return this.http.post<ApiResponse<SectionItemEntity>>(`${this.prefix}/${id}`, formData).pipe(
            map(({ data }) => mapSectionItemEntityToSectionItem(data)),
            tap((sectionItem) => {
                if (mode === SectionMode.LAYOUT) {
                    this.sectionService.sectionLayoutsListRs.update((sections) => {
                        if (!sections) return [];
                        return SectionUtils.updateSectionItemInSectionList(sections, sectionItem);
                    });
                    return;
                }

                // this.sectionService.sectionListResource.update((sections) => {
                //     if (!sections) return [];
                //     return SectionUtils.updateSectionItemInSectionList(sections, sectionItem);
                // });
                const pageId = this.pageService.pageId();
                this.pageService.pageByIdRs.update((page) => {
                    if (!page) return page;
                    return {
                        ...page,
                        sections: page.id === pageId ? SectionUtils.updateSectionItemInSectionList(page.sections || [], sectionItem) : page.sections
                    };
                });
            }),
            finalize(() => this.loading.set(false))
        );
    }

    duplicate(id: number, mode: SectionMode = SectionMode.CUSTOM) {
        this.loading.set(true);
        return this.http.post<ApiResponse<SectionItemEntity>>(`${this.prefix}/${id}/duplicate`, {}).pipe(
            map(({ data }) => mapSectionItemEntityToSectionItem(data)),
            tap((sectionItem) => {
                if (mode === SectionMode.LAYOUT) {
                    this.sectionService.sectionLayoutsListRs.update((sections) => {
                        if (!sections) return [];
                        return SectionUtils.insertSectionItemInSectionList(sections, sectionItem);
                    });
                    return;
                }

                // this.sectionService.sectionListResource.update((sections) => {
                //     if (!sections) return [];
                //     return SectionUtils.insertSectionItemInSectionList(sections, sectionItem);
                // });
                const pageId = this.pageService.pageId();
                this.pageService.pageByIdRs.update((page) => {
                    if (!page) return page;
                    return {
                        ...page,
                        sections: page.id === pageId ? SectionUtils.insertSectionItemInSectionList(page.sections || [], sectionItem) : page.sections
                    };
                });
            }),
            finalize(() => this.loading.set(false))
        );
    }

    delete(id: number, sectionId: number, mode: SectionMode = SectionMode.CUSTOM) {
        this.loading.set(true);
        return this.http.delete<ApiResponse<void>>(`${this.prefix}/${id}`).pipe(
            tap(() => {
               
                if (mode === SectionMode.LAYOUT) {
                    this.sectionService.sectionLayoutsListRs.update((sections) => {
                        if (!sections) return [];
                        return SectionUtils.removeSectionItemFromSectionList(sections, id, sectionId);
                    });
                    return;
                }

                
                const pageId = this.pageService.pageId();
               
                this.pageService.pageByIdRs.update((page) => {
                    if (!page) return page;
                    return {
                        ...page,
                        sections: page.id === pageId ? SectionUtils.removeSectionItemFromSectionList(page.sections || [], id, sectionId) : page.sections
                    };
                });
            }),
            finalize(() => this.loading.set(false))
        );
    }
}
