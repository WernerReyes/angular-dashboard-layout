import type { ApiResponse } from '@/shared/interfaces/api-response';
import type { Link } from '@/shared/interfaces/link';
import { type LinkEntity, mapLinkEntityToLink } from '@/shared/mappers/link.mapper';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateLink } from '../interfaces/link';
import { TransformUtils } from '@/utils/transform-utils';

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
            cache: 'reload'
        }),
        {
            parse: (value) => {
                const data = value as ApiResponse<LinkEntity[]>;
                return data.data.map((entity) => mapLinkEntityToLink(entity));
            }
        }
    );

    createLink(create: CreateLink) {
        const formData = TransformUtils.toFormData(create);
        return this.http.post<ApiResponse<LinkEntity>>(this.prefix, formData).pipe(
            map(({ data }) => mapLinkEntityToLink(data)),
            tap((link) => {
                this.linksListResource.update((links) => [link, ...links!]);
            })
        );
    }

    updateLink(id: number, update: Partial<CreateLink>) {
        const formData = TransformUtils.toFormData(update);
        return this.http.post<ApiResponse<LinkEntity>>(`${this.prefix}/${id}`, formData).pipe(
            map(({ data }) => mapLinkEntityToLink(data)),
            tap((link) => {
                this.linksListResource.update((links) => links!.map((l) => (l.id === link.id ? link : l)));
            })
        );
    }

    deleteLink(id: number) {
        return this.http.delete<ApiResponse<null>>(`${this.prefix}/${id}`).pipe(
            tap(() => {
                this.linksListResource.update((links) => links!.filter((l) => l.id !== id));
            })
        );
    }
}
