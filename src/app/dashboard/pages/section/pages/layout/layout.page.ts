import { PageService } from '@/dashboard/services/page.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import type { Page } from '@/shared/interfaces/page';
import type { Section } from '@/shared/interfaces/section';
import { Component, inject, linkedSignal, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import type { AssocieteSectionToPages } from '@/dashboard/interfaces/section';
import { SectionService } from '@/dashboard/services/section.service';
import { SectionMode } from '@/shared/mappers/section.mapper';
import { FormUtils } from '@/utils/form-utils';
import { JsonPipe } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { PopoverModule } from 'primeng/popover';
import { SectionForm } from '../../section-form/section-form';
import { SectionsList } from '../../sections-list/sections-list';

@Component({
    selector: 'app-layout-page',
    imports: [JsonPipe, SectionsList, MessageModule, ErrorBoundary, ReactiveFormsModule, MultiSelectModule, SectionForm, SelectModule, ButtonModule, ConfirmDialogModule, PopoverModule, ButtonModule],
    templateUrl: './layout.page.html',
    providers: [ConfirmationService]
})
export default class LayoutPage {
    private readonly fb = inject(FormBuilder);
    private readonly pageService = inject(PageService);
    private readonly sectionService = inject(SectionService);

    selectedSection = signal<Section | null>(null);

    display = signal<boolean>(false);

    pageList = this.pageService.pagesListResource;

    SectionMode = SectionMode;

    selectedPage = linkedSignal<Page | null>(() => {
        return this.pageList.hasValue() ? this.pageList.value()![0] : null;
    });

    form = this.fb.group({
        pagesIds: [[] as number[]]
    });

    
    FormUtils = FormUtils;

    setPages(section: Section) {
        const pagesIds = section.pages?.map((page) => page.id) || [];
        this.form.patchValue({ pagesIds });
    }


    associateToPages(section: Section) {
        if (this.form.invalid) return;

        const payload: AssocieteSectionToPages = {
            sectionId: section.id,
            pagesIds: this.form.value.pagesIds || []
        };

        this.sectionService.associateToPages(payload).subscribe({
            next: () => {
                // this.sectionService.sectionListResource.refresh();
                // this.messageService.addSuccess('Se han asociado las páginas correctamente.');
            },
            error: () => {
                // this.messageService.addError('Hubo un error al asociar las páginas.');
            }
        });
    }
}
