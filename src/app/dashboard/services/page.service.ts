import type { Page } from '@/shared/interfaces/page';
import { mapPageEntityToPage, PageEntity } from '@/shared/mappers/page.mapper';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal, Signal } from '@angular/core';
import { finalize, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response';
import type { CreatePage } from '../interfaces/page';

@Injectable({
    providedIn: 'root'
})
export class PageService {
    private readonly http = inject(HttpClient);

    private readonly prefix = `${environment.apiUrl}/page`;

    loading = signal<boolean>(false);

    pageId = signal<number | null>(null);

    pagesListResource = httpResource<Page[]>(
        () => ({
            url: this.prefix,
            method: 'GET',
            cache: 'reload'
        }),
        {
            parse: (value) => {
                const data = value as ApiResponse<PageEntity[]>;
                return data.data.map((entity) => mapPageEntityToPage(entity));
            }
        }
    );

    pageByIdRs = httpResource<Page | null>(
        () => {
            const id = this.pageId();

            if (!id) {
                return undefined;
            }

            return {
                url: `${this.prefix}/${id}`,
                method: 'GET',
                cache: 'reload'
            };
        },
        {
            parse: (value) => {
                const data = value as ApiResponse<PageEntity>;
                return mapPageEntityToPage(data.data);
            },
            defaultValue: null
        }
    );

    createPage(create: CreatePage) {
        this.loading.set(true);
        return this.http
            .post<ApiResponse<PageEntity>>(this.prefix, create, {
                withCredentials: true
            })
            .pipe(
                map(({ data }) => mapPageEntityToPage(data)),
                tap((page) => {
                    this.pagesListResource.update((pages) => {
                        if (pages) {
                            return [page, ...pages];
                        }
                        return [page];
                    });
                }),
                finalize(() => this.loading.set(false))
            );
    }

    updatePage(pageId: number, update: Partial<CreatePage>) {
        return this.http
            .put<ApiResponse<PageEntity>>(`${this.prefix}/${pageId}`, update, {
                withCredentials: true
            })
            .pipe(
                map(({ data }) => mapPageEntityToPage(data)),
                tap((page) => {
                    this.pagesListResource.update((pages) => {
                        if (pages) {
                            const index = pages.findIndex((p) => p.id === page.id);
                            if (index !== -1) {
                                pages[index] = page;
                            }
                            return [...pages];
                        }
                        return [page];
                    });
                }),
                finalize(() => this.loading.set(false))
            );
    }

    setMainPage(pageId: number) {
        return this.http.put<ApiResponse<null>>(`${this.prefix}/${pageId}/set-main`, null).pipe(
            tap(() => {
                this.pagesListResource.update((pages) => {
                    if (pages) {
                        const oldMainIndex = pages.findIndex((p) => p.isMain);
                        if (oldMainIndex !== -1) {
                            pages[oldMainIndex].isMain = false;
                        }

                        const index = pages.findIndex((p) => p.id === pageId);
                        if (index !== -1) {
                            pages[index].isMain = true;
                        }
                        return [...pages];
                    }
                    return [];
                });
            }),
            finalize(() => this.loading.set(false))
        );
    }

    deletePage(pageId: number) {
        return this.http.delete<ApiResponse<null>>(`${this.prefix}/${pageId}`).pipe(
            tap(() => {
                this.pagesListResource.update((pages) => {
                    if (pages) {
                        return pages.filter((p) => p.id !== pageId);
                    }
                    return [];
                });
            }),
            finalize(() => this.loading.set(false))
        );
    }
}
