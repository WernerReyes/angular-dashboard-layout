import { inject, Injectable, signal } from '@angular/core';
import type { Page } from '@/shared/interfaces/page';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response';

@Injectable({
    providedIn: 'root'
})
export class PageService {
    private readonly http = inject(HttpClient);

    private readonly prefix = `${environment.apiUrl}/page`;

    pagesList = signal<Page[]>([]);

    constructor() {
        this.getAll();
    }

    getAll() {
        this.http.get<ApiResponse<Page[]>>(this.prefix, {
            withCredentials: true
        }).subscribe({
            next: (response) => this.pagesList.set(response.data),
            error: (error) => console.error('Error fetching pages:', error)
        });
    }
}
