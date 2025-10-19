import { FilterLinksByTypePipe } from '@/dashboard/pipes/filter-links-by-type-pipe';
import { LinkService } from '@/dashboard/services/link.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { linkTypeOptions } from '@/shared/interfaces/link';
import { FormUtils } from '@/utils/form-utils';
import { JsonPipe, KeyValuePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'show-link-switch',
    imports: [ErrorBoundary, FilterLinksByTypePipe, ReactiveFormsModule, KeyValuePipe, SelectButtonModule, MessageModule, InputTextModule, ToggleSwitchModule, ToggleButtonModule, SelectModule],
    templateUrl: './show-link-switch.html'
})
export class ShowLinkSwitch {
    private readonly linkService = inject(LinkService);

    form = input.required<FormGroup<any>>();

    FormUtils = FormUtils;

    linksList = this.linkService.linksListResource;

    linkTypeOptions = linkTypeOptions;
}
