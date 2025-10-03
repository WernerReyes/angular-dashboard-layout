import type { ApiResponse } from '@/shared/interfaces/api-response';
import type { Link } from '@/shared/interfaces/link';
import { type LinkEntity, mapLinkEntityToLink } from '@/shared/mappers/link.mapper';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateLink } from '../interfaces/link';
import { map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LinkService {
    private readonly http = inject(HttpClient);
    prefix = `${environment.apiUrl}/link`;

    linksListResource = httpResource<Link[]>(
        () => ({
            url: this.prefix,
            method: 'GET',
            cache: 'reload',
            withCredentials: true
        }),
        {
            parse: (value) => {
                const data = value as ApiResponse<LinkEntity[]>;
                return data.data.map(mapLinkEntityToLink);
            }
        }
    );

    createLink(create: CreateLink) {
        return this.http.post<ApiResponse<LinkEntity>>(this.prefix, create, {
            withCredentials: true
        }).pipe(
            map(({ data }) => mapLinkEntityToLink(data)),
            tap((link) => {
                console.log('Link created:', link);
                this.linksListResource.update((links) => [link, ...links!]);
            })
        );
    }
}
