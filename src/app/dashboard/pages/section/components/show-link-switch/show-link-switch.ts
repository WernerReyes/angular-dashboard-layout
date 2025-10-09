import { Component, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormUtils } from '@/utils/form-utils';
import { MessageModule } from 'primeng/message';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { LinkService } from '@/dashboard/services/link.service';
import { SelectModule } from 'primeng/select';
import { FilterLinksByTypePipe } from '@/dashboard/pipes/filter-links-by-type-pipe';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'show-link-switch',
    imports: [ErrorBoundary, FilterLinksByTypePipe, ReactiveFormsModule, MessageModule, InputTextModule, ToggleSwitchModule, ToggleButtonModule, SelectModule],
    templateUrl: './show-link-switch.html'
})
export class ShowLinkSwitch {
    private readonly linkService = inject(LinkService);

    form = input.required<FormGroup<any>>();

    FormUtils = FormUtils;

    linksList = this.linkService.linksListResource;
}
