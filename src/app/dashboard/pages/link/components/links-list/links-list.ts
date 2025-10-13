import { LinkService } from '@/dashboard/services/link.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import type { Link } from '@/shared/interfaces/link';
import { LinkType } from '@/shared/mappers/link.mapper';
import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, inject, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { LinkFormService } from '../../services/link-form.service';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'links-list',
    imports: [ErrorBoundary, DataViewSkeleton, NgClass, DatePipe, FormsModule, InputTextModule, InputGroupModule, InputGroupAddonModule, DataViewModule, ButtonModule, ConfirmDialogModule],
    templateUrl: './links-list.html',
    providers: [ConfirmationService]
})
export class LinksList {
    private readonly confirmationService = inject(ConfirmationService);
    private readonly linkService = inject(LinkService);
    private readonly linkFormService = inject(LinkFormService);

    onDisplay = output<boolean>();
    onSelectedLink = output<Link>();

    LinkType = LinkType;

    linksList = this.linkService.linksListResource;

    searchQuery = signal<string>('');

    filteredLinksList = computed(() => {
        const query = this.searchQuery().toLowerCase();
        const links = this.linksList.hasValue() ? this.linksList.value() : [];
        if (!query) return links;
        return links.filter((link) => link.title.toLowerCase().includes(query));
    });

    openDialogAndEdit(link: Link) {
        this.onDisplay.emit(true);
        this.onSelectedLink.emit(link);

        this.linkFormService.populateForm(link);
    }

    deleteLink(event: Event, link: Link) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Estás seguro de que deseas eliminar este enlace?',
            header: 'Eliminar enlace',
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
                this.linkService.deleteLink(link.id).subscribe({
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
