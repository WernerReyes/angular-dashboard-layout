import { Component, inject, input } from '@angular/core';
import { CommonInputs } from '../common-inputs/common-inputs';
import { FileUpload } from '../../file-upload/file-upload';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { SectionItemFormService } from '../../../services/section-item-form.service';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterLinksByTypePipe } from '@/dashboard/pipes/filter-links-by-type-pipe';
import { FormUtils } from '@/utils/form-utils';
import { LinkService } from '@/dashboard/services/link.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'hero-form',
    imports: [CommonInputs, FileUpload, FilterLinksByTypePipe, ToggleSwitchModule, ReactiveFormsModule, ErrorBoundary, ToggleButtonModule, MessageModule, SelectModule],
    templateUrl: './hero-form.html'
})
export class HeroForm {
    private readonly sectionItemFormService = inject(SectionItemFormService);
    private readonly linkService = inject(LinkService);

    selectedSectionItem = input.required<SectionItem | null>();

    form = this.sectionItemFormService.form;

    FormUtils = FormUtils;

    linksList = this.linkService.linksListResource;

    // linkLis

}
