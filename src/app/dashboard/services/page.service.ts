import type { Page } from '@/shared/interfaces/page';
import { mapPageEntityToPage, PageEntity } from '@/shared/mappers/page.mapper';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal, Signal } from '@angular/core';
import { map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response';
import type { CreatePage } from '../interfaces/page';

@Injectable({
    providedIn: 'root'
})
export class PageService {
    private readonly http = inject(HttpClient);

    private readonly prefix = `${environment.apiUrl}/page`;

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

    private _pageId = signal<number | null>(null);

    getPageByIdRs = httpResource<Page | null>(
        () => {
            if (this._pageId() === null) {
                return undefined;
            }
           
            return{
            url: `${this.prefix}/${this._pageId()}`,
            method: 'GET',

            transferCache: true,
            keepalive: true,
            cache: 'reload'

            //   integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GhEXAMPLEKEY='
        }},
        {
            parse: (value) => {
                const data = value as ApiResponse<PageEntity>;
                return mapPageEntityToPage(data.data);
            },
            defaultValue: null,
            
        }
    );

    setPageId(pageId: number | null) {
        this._pageId.set(pageId);
    }

    createPage(create: CreatePage) {
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
                })
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
                })
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
            })
        );
    }
}
