import { LinkService } from '@/dashboard/services/link.service';
import { FallBack } from '@/shared/components/error/fall-back/fall-back';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import type { Link } from '@/shared/interfaces/link';
import { LinkType } from '@/shared/mappers/link.mapper';
import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DialogForm } from './components/dialog-form/dialog-form';

@Component({
    selector: 'app-link.page',
    imports: [DialogForm, DataViewSkeleton, FallBack, DialogModule, ButtonModule, DataViewModule, NgClass],
    templateUrl: './link.page.html'
})
export default class LinkPage {
    private readonly linkService = inject(LinkService);

    LinkType = LinkType;
    linksList = this.linkService.linksListResource;

    selectedLink = signal<Link | null>(null);

    display = signal<boolean>(false);

    openDialogAndEdit(link: Link) {
        this.selectedLink.set(link);
        this.display.set(true);
    }
    
}
