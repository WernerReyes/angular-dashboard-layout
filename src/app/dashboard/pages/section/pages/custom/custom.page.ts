import { PageService } from '@/dashboard/services/page.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import type { Page } from '@/shared/interfaces/page';
import type { Section } from '@/shared/interfaces/section';
import { Component, inject, linkedSignal, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import { SectionMode } from '@/shared/mappers/section.mapper';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SectionForm } from '../../section-form/section-form';
import { SectionsList } from '../../sections-list/sections-list';

@Component({
    selector: 'app-custom-page',
    imports: [ErrorBoundary, SectionsList, SectionForm, FormsModule, SelectModule, ButtonModule, ConfirmDialogModule],
    templateUrl: './custom.page.html',
    providers: [ConfirmationService]
})
export default class CustomPage {
    private readonly pageService = inject(PageService);

    selectedSection = signal<Section | null>(null);

    display = signal<boolean>(false);

    pageList = this.pageService.pagesListResource;

    SectionMode = SectionMode;

    selectedPage = linkedSignal<Page | null>(() => {
        const storedPageId = localStorage.getItem('selectedPage');
        const pageList = this.pageList.hasValue() ? this.pageList.value() : [];
        if (storedPageId) {
            const pageId = parseInt(storedPageId, 10);
            const page = pageList.find((p) => p.id === pageId) || null;
            return page;
        }
        return pageList[0] || null;
    });

    private setSelectedPageToLocalStorage = effect(() => {
        const page = this.selectedPage();
        if (page) {
            localStorage.setItem('selectedPage', page.id.toString());
        }
    });
}
