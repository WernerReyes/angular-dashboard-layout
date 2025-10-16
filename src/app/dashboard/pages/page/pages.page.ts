import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PagesList } from './components/pages-list/pages-list';
import type { Page } from '@/shared/interfaces/page';
import { DialogForm } from './components/dialog-form/dialog-form';
import { PageFormService } from './services/page-form.service';

@Component({
    selector: 'app-pages-page',
    imports: [PagesList, DialogForm, ButtonModule],
    templateUrl: './pages.page.html'
})
export default class PagesPage {
    //  private readonly linkFormService = inject(LinkFormService);
    private readonly pageFormService = inject(PageFormService);

    selectedPage = signal<Page | null>(null);

    display = signal<boolean>(false);

    closeDialog() {
        this.display.set(false);
        // this.linkFormService.reset();
        // this.linkFormService.clearTemporalValidators();
        this.pageFormService.reset();
        this.selectedPage.set(null);
    }
}
