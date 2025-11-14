import { PageService } from '@/dashboard/services/page.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import type { Page } from '@/shared/interfaces/page';
import type { Section } from '@/shared/interfaces/section';
import { Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectChangeEvent, SelectModule } from 'primeng/select';

import { SectionMode } from '@/shared/mappers/section.mapper';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PopoverModule } from 'primeng/popover';
import { SectionForm } from '../../section-form/section-form';
import { SectionsList } from '../../sections-list/sections-list';
import { SectionService } from '@/dashboard/services/section.service';

@Component({
    selector: 'app-custom-page',
    imports: [ErrorBoundary, SectionsList, SectionForm, PopoverModule, FormsModule, SelectModule, ButtonModule, ConfirmDialogModule],
    templateUrl: './custom.page.html',
    providers: [ConfirmationService]
})
export default class CustomPage {
    private readonly confirmationService = inject(ConfirmationService);
    private readonly sectionService = inject(SectionService);
    private readonly pageService = inject(PageService);

    selectedSection = signal<Section | null>(null);

    display = signal<boolean>(false);

    pagesListRs = this.pageService.pagesListResource;

    SectionMode = SectionMode;
    

    selectedPage = linkedSignal<Page | null>(() => {
        const storedPageId = localStorage.getItem('selectedPage');
        const pageList = this.pagesListRs.hasValue() ? this.pagesListRs.value() : [];
        if (storedPageId) {
            const pageId = parseInt(storedPageId, 10);
            const page = pageList.find((p) => p.id === pageId) || null;
            return page;
        }
        return pageList[0] || null;
    });

    pages = computed<Page[]>(() => {
        const pages = this.pagesListRs.hasValue() ? this.pagesListRs.value() : [];
        return pages.filter((page) => page.id !== this.selectedPage()?.id);
    });

    moveToPage(e: SelectChangeEvent, section: Section, newPageId: number) {
        const page = this.selectedPage();
        if (page && section) {
            this.confirmationService.confirm({
            target: e.originalEvent?.target as EventTarget,
            message: "¿Estás seguro de que deseas mover la sección '" + section.title + "' a la página '" + this.pages().find(p => p.id === newPageId)?.title + "'?",
            header: "Confirmar movimiento",
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Confirmar'
            },
            accept: () => {
                this.sectionService.moveSectionToPage(section.id, page.id, newPageId).subscribe({
                    next: () => {
                        this.selectedSection.set(null);
                    }
                });
            },
            // accept,
            // reject
        });
            
        }
    }



    private setSelectedPageToLocalStorage = effect(() => {
        const page = this.selectedPage();
        if (page) {
            localStorage.setItem('selectedPage', page.id.toString());
        }
    });
}
