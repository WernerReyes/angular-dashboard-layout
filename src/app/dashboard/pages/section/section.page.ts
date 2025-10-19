import { PageService } from '@/dashboard/services/page.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import type { Page } from '@/shared/interfaces/page';
import type { Section } from '@/shared/interfaces/section';
import { Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { SectionForm } from './section-form/section-form';
import { SectionsList } from './sections-list/sections-list';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-section-page',
    imports: [ErrorBoundary, SectionsList, SectionForm, FormsModule, SelectModule, ButtonModule, ConfirmDialogModule],
    templateUrl: './section.page.html',
    providers: [ConfirmationService]
})
export default class SectionPage {
    private readonly pageService = inject(PageService);

    
    selectedSection = signal<Section | null>(null);
    
    display = signal<boolean>(false);
    
    pageList = this.pageService.pagesListResource;
    
    // selectedPage = linkedSignal<Page | null>(() =>  {
    //     return this.pageList.hasValue() ? this.pageList.value()![0] : null;
    // });

     selectedPage = signal<Page | null>(null);


    //  setPageId = computed(() => {
    //     const pageId = this.selectedPage()?.id ?? null;
    //     console.log('Setting page ID to:', pageId);
    //     // this.pageService.setPageId(pageId);
    //     return pageId;
    // });

    private effect = effect(() => {
        const pageId = this.selectedPage()?.id ?? null;
        console.log('Effect triggered. Setting page ID to:', pageId);
        // this.pageService.setPageId(pageId);        
    });

}
