import type { Page } from '@/shared/interfaces/page';
import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response';
import { map, tap } from 'rxjs';
import { mapPageEntityToPage, PageEntity } from '@/shared/mappers/page.mapper';

@Injectable({
    providedIn: 'root'
})
export class PageService {
    private readonly http = inject(HttpClient);

    private readonly prefix = `${environment.apiUrl}/page`;

    pagesList = signal<Page[]>([]);

    pageIdsActived = signal<number[] | null>(null);

    freePagesOnlyList = computed(() => []);

    constructor() {
        this.getAll().subscribe();
    }

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
                return data.data.map(mapPageEntityToPage);
            }
        }
    );

    getAll() {
        return this.http
            .get<ApiResponse<PageEntity[]>>(this.prefix, {
                withCredentials: true
            })
            .pipe(
                map(({ data }) => data.map(mapPageEntityToPage)),
                tap((pages) => {
                    console.log('Fetched pages:', pages);
                    this.pagesList.set(pages);
                })
            );
    }
}
