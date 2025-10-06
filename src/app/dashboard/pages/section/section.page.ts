import { PageService } from '@/dashboard/services/page.service';
import type { Page } from '@/shared/interfaces/page';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { SectionsList } from './sections-list/sections-list';
import { SectionForm } from './section-form/section-form';
import type { Section } from '@/shared/interfaces/section';

@Component({
    selector: 'app-section-page',
    imports: [ErrorBoundary, SectionsList, SectionForm, FormsModule, SelectModule, ButtonModule],
    templateUrl: './section.page.html'
})
export default class SectionPage {
    private readonly pageService = inject(PageService);

    selectedPage = signal<Page | null>(null);

    selectedSection = signal<Section | null>(null);

    display = signal<boolean>(false);

    pageList = this.pageService.pagesListResource;
}
