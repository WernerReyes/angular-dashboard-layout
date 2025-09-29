import { PageService } from '@/dashboard/services/page.service';
import { FormUtils } from '@/utils/form-utils';
import { Component, inject, input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'menu-type-internal-page',
    imports: [ToggleSwitchModule, SelectModule, ReactiveFormsModule],
    templateUrl: './internal-page.html'
})
export class InternalPage {
    private readonly pageService = inject(PageService);

    FormUtils = FormUtils;

    form = input.required<FormGroup>();

    pages = this.pageService.freePagesOnlyList;

    selectedPage = signal(undefined);

    checked = signal(true);
}
