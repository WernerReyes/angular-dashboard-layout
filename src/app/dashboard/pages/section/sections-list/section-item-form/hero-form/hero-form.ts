import { LinkService } from '@/dashboard/services/link.service';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { FormUtils } from '@/utils/form-utils';
import { Component, inject, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ShowLinkSwitch } from '../../../components/show-link-switch/show-link-switch';
import { SectionItemFormService } from '../../../services/section-item-form.service';
import { FileUpload } from '../../../components/file-upload/file-upload';
import { CommonInputs } from '../../../components/common-inputs/common-inputs';

@Component({
    selector: 'hero-form',
    imports: [CommonInputs, FileUpload, ShowLinkSwitch,  ToggleSwitchModule, ReactiveFormsModule, InputTextModule, ToggleButtonModule, MessageModule, SelectModule],
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
