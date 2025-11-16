import type { ApiResponse } from '@/shared/interfaces/api-response';
import { Section } from '@/shared/interfaces/section';
import { mapSectionEntityToSection, SectionEntity } from '@/shared/mappers/section.mapper';
import { TransformUtils } from '@/utils/transform-utils';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UpdateOrder } from '../interfaces/common';
import type { AssocieteSectionToPages, CreateSection, UpdateSection } from '../interfaces/section';

@Injectable({
    providedIn: 'root'
})
export class SectionService {
    private readonly http = inject(HttpClient);
    private readonly prefix = `${environment.apiUrl}/section`;

    isCreating = signal(false);
    isUpdating = signal(false);
    loading = signal(false);

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
            tap((createdSection) => {
                this.sectionListResource.update((sections) => {
                    if (!sections) return [createdSection];
                    return [...sections, createdSection];
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

        return this.http.post<ApiResponse<SectionEntity>>(`${this.prefix}/${id}`, formData).pipe(
            map(({ data }) => mapSectionEntityToSection(data)),
            tap((section) => {
                this.sectionListResource.update((sections) => {
                    if (!sections) return [];
                    return sections.map((s) => (s.id === section.id ? { ...section, items: s.items } : s));
                });

                this.isUpdating.set(false);
            }),
            catchError((error) => {
                this.isUpdating.set(false);
                return throwError(() => error);
            })
        );
    }

    duplicateSection(id: number, pageId: number | null) {
        this.loading.set(true);
        return this.http.post<ApiResponse<SectionEntity>>(`${this.prefix}/${id}/duplicate`, {
            pageId
        }).pipe(
            map(({ data }) => mapSectionEntityToSection(data)),
            tap((duplicatedSection) => {
                this.sectionListResource.update((sections) => {
                    if (!sections) return [duplicatedSection];
                    return [...sections, duplicatedSection];
                });
            }),
            finalize(() => this.loading.set(false))
        );
    }

    moveSectionToPage(sectionId: number, fromPageId: number, toPageId: number) {
        console.log('Moving section', { sectionId, fromPageId, toPageId });
        return this.http.post<ApiResponse<SectionEntity>>(`${this.prefix}/${sectionId}/move-to-page`, { fromPageId, toPageId }).pipe(
            map(({ data }) => mapSectionEntityToSection(data)),
            tap((sectionUpdated) => {
                this.sectionListResource.update((sections) => {
                    if (!sections) return [];
                    return sections.map((section) => {
                        if (section.id === sectionId) {
                            return {
                                ...sectionUpdated,
                                items: section.items,
                                machines: section.machines,
                                menus: section.menus
                            };
                        }

                        return section;
                    });
                });
                // this.pageService.pagesListResource.update((pages) => {
                //     if (!pages) return [];
                //     return pages.map((page) => {
                //         if (page.id === toPageId) {
                //             return {
                //                 ...page,
                //                 sections: page.sections ? [...page.sections, movedSection] : [movedSection]
                //             };
                //         }
                //         if (page.id === fromPageId) {
                //             return {
                //                 ...page,
                //                 sections: page.sections ? page.sections.filter((s) => s.id !== movedSection.id) : []
                //             };
                //         }
                //         return page;
                //     });
                // });
            })
        );
    }

    associateToPages({ pagesIds, sectionId }: AssocieteSectionToPages) {
        this.loading.set(true);
        return this.http.post<ApiResponse<SectionEntity>>(`${this.prefix}/${sectionId}/pages`, { pagesIds }).pipe(
            map(({ data }) => mapSectionEntityToSection(data)),
            tap((updatedSection) => {
                this.sectionListResource.update((sections) => {
                    if (!sections) return [];
                    return sections.map((s) => (s.id === updatedSection.id ? { ...updatedSection, items: s.items, menus: s.menus } : s));
                });
            }),
            finalize(() => this.loading.set(false))
        );
    }

    updateSectionsOrder(order: UpdateOrder) {
        return this.http.put<ApiResponse<null>>(`${this.prefix}/order`, order);
    }

    deleteSection(id: number, pageId?: number) {
        return this.http
            .delete<ApiResponse<null>>(`${this.prefix}/${id}`, {
                params: pageId ? { pageId: pageId.toString() } : {}
            })
            .pipe(
                tap(() => {
                    this.sectionListResource.update((sections) => {
                        if (!sections) return [];
                        if (pageId) {
                            return sections.map((section) => {
                                if (section.id === id) {
                                    return {
                                        ...section,
                                        pivotPages: section.pivotPages?.filter((pivot) => pivot.idPage !== pageId) || [],
                                        pages: section.pages?.filter((page) => page.id !== pageId) || []
                                    };
                                }
                                return section;
                            });
                        }

                        return sections.filter((section) => section.id !== id);
                    });
                })
            );
    }
}
