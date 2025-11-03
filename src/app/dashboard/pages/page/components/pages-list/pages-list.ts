import { PageService } from '@/dashboard/services/page.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import type { Page } from '@/shared/interfaces/page';
import { FilterByPipe } from '@/shared/pipes/filter-by-pipe';
import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, inject, output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { PageFormService } from '../../services/page-form.service';

@Component({
    selector: 'pages-list',
    imports: [ErrorBoundary, DataViewSkeleton, FilterByPipe, ContextMenuModule, TagModule, NgClass, DatePipe, FormsModule, InputTextModule, ConfirmDialogModule, InputGroupModule, InputGroupAddonModule, DataViewModule, ButtonModule],
    templateUrl: './pages-list.html',
    providers: [ConfirmationService]
})
export class PagesList {
    private readonly confirmationService = inject(ConfirmationService);
    private readonly pagesService = inject(PageService);
    private readonly pageFormService = inject(PageFormService);

    @ViewChild('cm') cm!: ContextMenu;

    // loading = this.pagesService.loading;
    loading = computed(() => this.pagesService.loading());

    onDisplay = output<boolean>();
    onSelectedPage = output<Page>();

    pagesList = this.pagesService.pagesListResource;

    searchQuery = signal<string>('');

    selectedPage = signal<Page | null>(null);

    actions = computed<MenuItem[]>(() => {
        return [
            {
                label: 'Marcar como principal',
                icon: 'pi pi-star',
                command: () => {
                    const page = this.selectedPage();
                    if (!page) return;
                    this.pagesService.setMainPage(page.id).subscribe();
                },
                disabled: this.loading() || (this.selectedPage() ? this.selectedPage()!.isMain : true)
            },
            { label: 'Editar', icon: 'pi pi-pencil', disabled: this.loading(), command: () => this.openDialogAndEdit() },
            { label: 'Eliminar', icon: 'pi pi-trash', disabled: this.loading(), command: (event: MenuItemCommandEvent) => this.deletePage(event.originalEvent!) }
        ];
    });

    openDialogAndEdit() {
        if (!this.selectedPage()) return;
        this.onDisplay.emit(true);
        this.onSelectedPage.emit(this.selectedPage()!);

        this.pageFormService.populateForm(this.selectedPage()!);
    }

    onContextMenu(event: any) {
        this.cm.target = event.currentTarget;
        this.cm.show(event);
    }

    deletePage(event: Event) {
        const page = this.selectedPage();
        if (!page) return;
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
