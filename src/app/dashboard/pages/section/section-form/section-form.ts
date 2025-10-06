import { CreateSection } from '@/dashboard/interfaces/section';
import { LinkService } from '@/dashboard/services/link.service';
import { SectionService } from '@/dashboard/services/section.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { sectionTypesOptions, type Section } from '@/shared/interfaces/section';
import { LinkType } from '@/shared/mappers/link.mapper';
import { SectionType } from '@/shared/mappers/section.mapper';
import { FormUtils } from '@/utils/form-utils';
import { Component, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FilterLinksByTypePipe } from '../pipes/filter-links-by-type-pipe';
import { SectionFormService } from '../services/section-form.service';

@Component({
    selector: 'section-form',
    imports: [ErrorBoundary, FilterLinksByTypePipe, ReactiveFormsModule, InputTextModule, ToggleSwitchModule, TextareaModule, SelectModule, DialogModule, MessageModule, ButtonModule, ToggleButtonModule],
    templateUrl: './section-form.html'
})
export class SectionForm {
    private readonly linkService = inject(LinkService);
    private readonly sectionService = inject(SectionService);
    private readonly sectionFormService = inject(SectionFormService);

    onCloseDialog = output<void>();
    display = input.required<boolean>();
    selectedSection = input<Section | null>();
    selectedPageId = input.required<number>();

    form = this.sectionFormService.form;

    linksList = this.linkService.linksListResource;

    sectionTypes = Object.values(sectionTypesOptions);

    FormUtils = FormUtils;
    SectionType = SectionType;

    LinkType = LinkType;

    getDialogWidth(): {
        width: string;
    } {
        let width = '20rem';
        const type = this.form.get('type')?.value;
        if (type === SectionType.HERO) width = '20rem';
        return {
            width
        };
    }

    saveChanges() {
        if (this.form.valid) {
            const formValue = this.form.value;
            const sectionData: CreateSection = {
                type: formValue.type!,
                title: formValue.title!,
                subtitle: formValue.subtitle || null,
                description: formValue.content || null,
                textButton: formValue.textButton || null,
                linkId: formValue.showLink ? (formValue.linkId as any) : null,
                active: formValue.active!,
                pageId: this.selectedPageId()
            };

            console.log(sectionData);

            if (this.selectedSection()) {
                this.sectionService.updateSection(this.selectedSection()!.id, sectionData).subscribe({
                    next: () => {
                        this.onCloseDialog.emit();
                    }
                });
                return;
            }

            this.sectionService.createSection(sectionData).subscribe({
                next: () => {
                    this.onCloseDialog.emit();
                    this.sectionFormService.reset();
                },
                error: () => {
                    this.onCloseDialog.emit();
                }
            });
        }
    }
}
