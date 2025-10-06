import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PagesList } from './components/pages-list/pages-list';
import type { Page } from '@/shared/interfaces/page';
import { DialogForm } from './components/dialog-form/dialog-form';

@Component({
    selector: 'app-pages-page',
    imports: [PagesList, DialogForm, ButtonModule],
    templateUrl: './pages.page.html'
})
export default class PagesPage {
    //  private readonly linkFormService = inject(LinkFormService);

    selectedPage = signal<Page | null>(null);

    display = signal<boolean>(false);

    closeDialog() {
        this.display.set(false);
        // this.linkFormService.reset();
        // this.linkFormService.clearTemporalValidators();
        this.selectedPage.set(null);
    }
}
