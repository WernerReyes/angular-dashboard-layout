import type { ApiResponse } from '@/shared/interfaces/api-response';
import type { Link } from '@/shared/interfaces/link';
import { type LinkEntity, mapLinkEntityToLink } from '@/shared/mappers/link.mapper';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateLink } from '../interfaces/link';
import { catchError, map, tap, throwError } from 'rxjs';
import { MessageService } from '@/shared/services/message.service';

@Injectable({
    providedIn: 'root'
})
export class LinkService {
    private readonly http = inject(HttpClient);
    private readonly messageService = inject(MessageService);
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
                return data.data.map((entity) => mapLinkEntityToLink(entity));
            }
        }
    );

    createLink(create: CreateLink) {
        return this.http.post<ApiResponse<LinkEntity>>(this.prefix, create).pipe(
            map(({ data, message }) => ({
                link: mapLinkEntityToLink(data),
                message
            })),
            tap(({ message, link }) => {
                this.messageService.setSuccess(message);
                this.linksListResource.update((links) => [link, ...links!]);
            })
        );
    }

    updateLink(id: number, update: Partial<CreateLink>) {
        return this.http.put<ApiResponse<LinkEntity>>(`${this.prefix}/${id}`, update).pipe(
            map(({ data, message }) => ({
                link: mapLinkEntityToLink(data),
                message
            })),
            tap(({ message, link }) => {
                this.messageService.setSuccess(message);
                this.linksListResource.update((links) => links!.map((l) => (l.id === link.id ? link : l)));
            })
        );
    }

    deleteLink(id: number) {
        return this.http.delete<ApiResponse<null>>(`${this.prefix}/${id}`).pipe(
            tap(({ message }) => {
                this.messageService.setSuccess(message);
                this.linksListResource.update((links) => links!.filter((l) => l.id !== id));
            }),
            catchError((error) => {
                this.messageService.setError(error.error?.message);
                return throwError(() => error);
            })
        );
    }
}
