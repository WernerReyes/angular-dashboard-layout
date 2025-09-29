import { ToggleSwitch } from '@/shared/components/toggle-switch/toggle-switch';
import { PageService } from '@/dashboard/services/page.service';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MenuFormService } from '@/dashboard/services/menu-form.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { JsonPipe } from '@angular/common';
import { FormUtils } from '@/utils/form-utils';

@Component({
    selector: 'menu-type-internal-page',
    imports: [JsonPipe, ToggleSwitchModule, SelectModule, ReactiveFormsModule],
    templateUrl: './internal-page.html'
})
export class InternalPage {
    private readonly pageService = inject(PageService);
    private readonly menuFormService = inject(MenuFormService);

    FormUtils = FormUtils;

    form = this.menuFormService.form;

    pages = computed(() => this.pageService.pagesList());

    selectedPage = signal(undefined);

    checked = signal(true);
}
