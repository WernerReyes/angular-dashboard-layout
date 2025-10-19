import { PageService } from '@/dashboard/services/page.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import type { Page } from '@/shared/interfaces/page';
import type { Section } from '@/shared/interfaces/section';
import { Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SectionForm } from '../../section-form/section-form';
import { SectionsList } from '../../sections-list/sections-list';

@Component({
    selector: 'app-personalized-page',
    imports: [ErrorBoundary, SectionsList, SectionForm, FormsModule, SelectModule, ButtonModule, ConfirmDialogModule],
    templateUrl: './personalized.page.html',
    providers: [ConfirmationService]
})
export default class PersonalizedPage {
    private readonly pageService = inject(PageService);

    selectedSection = signal<Section | null>(null);

    display = signal<boolean>(false);

    pageList = this.pageService.pagesListResource;

    selectedPage = linkedSignal<Page | null>(() => {
        return this.pageList.hasValue() ? this.pageList.value()![0] : null;
    });

    
    // private effect = effect(() => {
    //     const pageId = this.selectedPage()?.id ?? null;
    //     console.log('Effect triggered. Setting page ID to:', pageId);
    //     this.pageService.setPageId(pageId);
    // })
}
