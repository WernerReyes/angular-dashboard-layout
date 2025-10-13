import { PageService } from '@/dashboard/services/page.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import type { Page } from '@/shared/interfaces/page';
import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PageFormService } from '../../services/page-form.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FilterByTermPipe } from '@/dashboard/pipes/filter-by-term-pipe';

@Component({
    selector: 'pages-list',
    imports: [ErrorBoundary, DataViewSkeleton, FilterByTermPipe, NgClass, DatePipe, FormsModule, InputTextModule, ConfirmDialogModule, InputGroupModule, InputGroupAddonModule, DataViewModule, ButtonModule],
    templateUrl: './pages-list.html',
    providers: [ConfirmationService]
})
export class PagesList {
    private readonly confirmationService = inject(ConfirmationService);
    private readonly pagesService = inject(PageService);
    private readonly pageFormService = inject(PageFormService);

    onDisplay = output<boolean>();
    onSelectedPage = output<Page>();

    pagesList = this.pagesService.pagesListResource;

    searchQuery = signal<string>('');

    openDialogAndEdit(page: Page) {
        this.onDisplay.emit(true);
        this.onSelectedPage.emit(page);

        this.pageFormService.populateForm(page);
    }

    deletePage(event: Event, page: Page) {
 this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Estás seguro de que deseas eliminar esta página?',
            header: 'Eliminar página',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Eliminar'
            },
            accept: () => {
                this.pagesService.deletePage(page.id).subscribe({
                    next: () => {
                        this.confirmationService.close();
                    },
                    error: () => {
                        this.confirmationService.close();
                    }
                });
            },
            reject: () => {
                this.confirmationService.close();
            }
        });
    }
}
