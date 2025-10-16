import type { Page } from '@/shared/interfaces/page';
import { mapPageEntityToPage, PageEntity } from '@/shared/mappers/page.mapper';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
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
            cache: 'reload',
            withCredentials: true
        }),
        {
            parse: (value) => {
                const data = value as ApiResponse<PageEntity[]>;
                return data.data.map((entity) => mapPageEntityToPage(entity));
            }
        }
    );

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
                }),
                
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
           
        );
    }
}
