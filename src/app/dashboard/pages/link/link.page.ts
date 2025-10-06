import type { Link } from '@/shared/interfaces/link';
import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DialogForm } from './components/dialog-form/dialog-form';
import { LinksList } from './components/links-list/links-list';
import { LinkFormService } from './services/link-form.service';

@Component({
    selector: 'app-link.page',
    imports: [DialogForm, LinksList, DialogModule, ButtonModule, DataViewModule],
    templateUrl: './link.page.html'
})
export default class LinkPage {
    private readonly linkFormService = inject(LinkFormService);

    selectedLink = signal<Link | null>(null);

    display = signal<boolean>(false);

    closeDialog() {
        this.display.set(false);
        this.linkFormService.reset();
        this.linkFormService.clearTemporalValidators();
        this.selectedLink.set(null);
    }
}
