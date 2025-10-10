import { CreateSection } from '@/dashboard/interfaces/section';
import { LinkService } from '@/dashboard/services/link.service';
import { SectionService } from '@/dashboard/services/section.service';
import { sectionTypesOptions, type Section } from '@/shared/interfaces/section';
import { LinkType } from '@/shared/mappers/link.mapper';
import { SectionType } from '@/shared/mappers/section.mapper';
import { FormUtils } from '@/utils/form-utils';
import { JsonPipe, KeyValuePipe } from '@angular/common';
import { Component, inject, input, model, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CommonInputs } from '../components/common-inputs/common-inputs';
import { ShowLinkSwitch } from '../components/show-link-switch/show-link-switch';
import { SectionFormService } from '../services/section-form.service';
import { WhyUsForm } from './why-us-form/why-us-form';
import { FileUpload } from '../components/file-upload/file-upload';
import { ImageType } from '@/shared/interfaces/section-item';

@Component({
    selector: 'section-form',
    imports: [CommonInputs, ShowLinkSwitch, FileUpload, WhyUsForm, ReactiveFormsModule, InputTextModule, KeyValuePipe, JsonPipe, ToggleSwitchModule, TextareaModule, SelectModule, DialogModule, MessageModule, ButtonModule, ToggleButtonModule],
    templateUrl: './section-form.html'
})
export class SectionForm {
    private readonly linkService = inject(LinkService);
    private readonly sectionService = inject(SectionService);
    private readonly sectionFormService = inject(SectionFormService);

    onCloseDialog = output<void>();
    display = input.required<boolean>();
    selectedSection = model<Section | null>();
    selectedPageId = input.required<number>();

    form = this.sectionFormService.form;

    linksList = this.linkService.linksListResource;

    sectionTypesOptions = sectionTypesOptions;

    FormUtils = FormUtils;
    SectionType = SectionType;

    LinkType = LinkType;

    closeDialog() {
        this.onCloseDialog.emit();
        this.sectionFormService.reset();
        this.selectedSection.set(null);
    }

    saveChanges() {
        if (this.form.valid) {
            const formValue = this.form.value;
            const sectionData: CreateSection = {
                type: formValue.type!,
                title: formValue.title!,
                subtitle: formValue.subtitle || null,
                description: formValue.content || null,
                textButton: formValue.showLink ? formValue.textButton || null : null,
                linkId: formValue.showLink ? (formValue.linkId as any) : null,
                active: formValue.active!,
                pageId: this.selectedPageId(),
                fileImage: formValue.imageType === ImageType.LOCAL ? (formValue.imageFile as any) : null,
                imageUrl: formValue.imageType === ImageType.URL ? formValue.imageUrl || null : null
            };

            if (this.selectedSection()) {
                this.sectionService.updateSection(this.selectedSection()!.id, sectionData).subscribe({
                    next: () => {
                        this.closeDialog();
                    }
                });
                return;
            }

            this.sectionService.createSection(sectionData).subscribe({
                next: () => {
                    this.onCloseDialog.emit();
                    this.sectionFormService.reset();
                }
            });
        }
    }
}
