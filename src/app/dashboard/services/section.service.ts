import type { ApiResponse } from '@/shared/interfaces/api-response';
import { Section } from '@/shared/interfaces/section';
import { mapSectionEntityToSection, SectionEntity, SectionMode, SectionType } from '@/shared/mappers/section.mapper';
import { TransformUtils } from '@/utils/transform-utils';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UpdateOrder } from '../interfaces/common';
import type { AssocieteSectionToPages, CreateSection, UpdateSection } from '../interfaces/section';
import { PageService } from './page.service';

@Injectable({
    providedIn: 'root'
})
export class SectionService {
    private readonly http = inject(HttpClient);
    private readonly pageService = inject(PageService);
    private readonly prefix = `${environment.apiUrl}/section`;

    isCreating = signal(false);
    isUpdating = signal(false);
    loading = signal(false);


    sectionLayoutsListRs = httpResource<Section[]>(
        () => ({
            url: `${this.prefix}/layouts`,
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

    createSection(section: CreateSection, mode: SectionMode = SectionMode.CUSTOM) {
        const formData = TransformUtils.toFormData(section);
        this.isCreating.set(true);

        return this.http.post<ApiResponse<SectionEntity>>(this.prefix, formData).pipe(
            map(({ data }) => mapSectionEntityToSection(data)),
            tap((createdSection) => {
                // let list = this.sectionListResource;
                if (mode === SectionMode.LAYOUT) {
                    this.sectionLayoutsListRs.update((sections) => {
                        if (!sections) return [createdSection];
                        return [...sections, createdSection];
                    });
                    return;
                }
                this.pageService.pageByIdRs.update((page) => {
                    if (!page) return page;
                    return {
                        ...page,
                        sections: section.pageId === page.id ? [...(page.sections || []), createdSection] : page.sections
                    };
                });

                this.isCreating.set(false);
            }),
            catchError((error) => {
                this.isCreating.set(false);
                return throwError(() => error);
            })
        );
    }

    updateSection(id: number, section: UpdateSection, mode: SectionMode = SectionMode.CUSTOM) {
        const formData = TransformUtils.toFormData(section);
        this.isUpdating.set(true);

        return this.http.post<ApiResponse<SectionEntity>>(`${this.prefix}/${id}`, formData).pipe(
            map(({ data }) => mapSectionEntityToSection(data)),
            tap((section) => {
                if (mode === SectionMode.LAYOUT) {
                    this.sectionLayoutsListRs.update((sections) => {
                        if (!sections) return [];
                        return sections.map((s) => (s.id === section.id ? { ...section, items: s.items } : s));
                    });
                    return;
                }
                // this.sectionListResource.update((sections) => {
                //     if (!sections) return [];
                //     return sections.map((s) => (s.id === section.id ? { ...section, items: s.items } : s));
                // });

                // this.isUpdating.set(false);

                this.pageService.pageByIdRs.update((page) => {
                    if (!page) return page;
                    return {
                        ...page,
                        sections: page.sections ? page.sections.map((s) => (s.id === section.id ? { ...section, items: s.items } : s)) : []
                    };
                });
            }),
            catchError((error) => {
                // this.isUpdating.set(false);
                return throwError(() => error);
            }),
            finalize(() => this.isUpdating.set(false))
        );
    }

    duplicateSection(id: number, pageId: number | null, mode: SectionMode = SectionMode.CUSTOM) {
        this.loading.set(true);
        return this.http
            .post<ApiResponse<SectionEntity>>(`${this.prefix}/${id}/duplicate`, {
                pageId
            })
            .pipe(
                map(({ data }) => mapSectionEntityToSection(data)),
                tap((duplicatedSection) => {
                    if (mode === SectionMode.LAYOUT) {
                        this.sectionLayoutsListRs.update((sections) => {
                            if (!sections) return [duplicatedSection];
                            return [...sections, duplicatedSection];
                        });
                        return;
                    }
                    // this.sectionListResource.update((sections) => {
                    //     if (!sections) return [duplicatedSection];
                    //     return [...sections, duplicatedSection];
                    // });
                    this.pageService.pageByIdRs.update((page) => {
                        if (!page) return page;
                       
                        return {
                            ...page,
                            sections: page.id === pageId ? [...(page.sections || []), duplicatedSection] : page.sections
                        };
                    });
                }),
                finalize(() => this.loading.set(false))
            );
    }

    moveSectionToPage(sectionId: number, fromPageId: number, toPageId: number) {
        return this.http.post<ApiResponse<SectionEntity>>(`${this.prefix}/${sectionId}/move-to-page`, { fromPageId, toPageId }).pipe(
            map(({ data }) => mapSectionEntityToSection(data)),
            tap(() => {
                
                this.pageService.pageByIdRs.update((page) => {
                    if (!page) return page;
                    const sections = page.sections || [];
                    return {
                        ...page,
                        sections: sections.filter((section) => section.id !== sectionId)
                    };
                   
                });
               
            })
        );
    }

    associateToPages({ pagesIds, sectionId }: AssocieteSectionToPages) {
        this.loading.set(true);
        return this.http.post<ApiResponse<SectionEntity>>(`${this.prefix}/${sectionId}/pages`, { pagesIds }).pipe(
            map(({ data }) => mapSectionEntityToSection(data)),
            tap((updatedSection) => {
                
                let section = updatedSection;
                this.sectionLayoutsListRs.update((sections) => {
                    if (!sections) return [];
                    return sections.map((s) => {
                        if (s.id === updatedSection.id) {
                            section = {
                                ...updatedSection,
                                items: s.items,
                                menus: s.menus,
                                machines: s.machines
                            };
                            return section;
                        }
                        return s;
                    });
                });

                this.pageService.pageByIdRs.update((page) => {
                    if (!page) return page;
                    const sections = page.sections || [];
                    return {
                        ...page,
                        sections: pagesIds.includes(page.id) ? [...sections, section] : sections.filter((s) => s.id !== section.id)
                    };
                });
            }),
            finalize(() => this.loading.set(false))
        );
    }

    updateSectionsOrder(order: UpdateOrder) {
        return this.http.put<ApiResponse<null>>(`${this.prefix}/order`, order);
    }

    deleteSection(id: number, pageId?: number, mode: SectionMode = SectionMode.CUSTOM) {
        return this.http
            .delete<ApiResponse<null>>(`${this.prefix}/${id}`, {
                params: pageId ? { pageId: pageId.toString() } : {}
            })
            .pipe(
                tap(() => {
                   
                    if (mode === SectionMode.LAYOUT) {
                        this.sectionLayoutsListRs.update((sections) => {
                            if (!sections) return [];
                            return sections.filter((section) => section.id !== id);
                        });
                        return;
                    }

                    this.sectionLayoutsListRs.update((sections) => {
                        if (!sections) return [];
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
                    });

                    this.pageService.pageByIdRs.update((page) => {
                        if (!page) return page;
                        return {
                            ...page,
                            sections: page.sections ? page.sections.filter((section) => section.id !== id) : []
                        };
                    });

                   
                })
            );
    }
}
