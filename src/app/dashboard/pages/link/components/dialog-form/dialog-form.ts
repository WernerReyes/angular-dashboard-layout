import { CreateLink } from '@/dashboard/interfaces/link';
import { LinkService } from '@/dashboard/services/link.service';
import { PageService } from '@/dashboard/services/page.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { linkTypeOptions, type Link } from '@/shared/interfaces/link';
import { LinkType } from '@/shared/mappers/link.mapper';
import { FormUtils } from '@/utils/form-utils';
import { Component, computed, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';
import { LinkFormService } from '../../services/link-form.service';

@Component({
    selector: 'link-dialog-form',
    imports: [DialogModule, ErrorBoundary, ReactiveFormsModule, InputTextModule, MessageModule, SkeletonModule, SelectModule, SelectButtonModule, ButtonModule],
    templateUrl: './dialog-form.html'
})
export class DialogForm {
    private readonly pageService = inject(PageService);
    private readonly linkService = inject(LinkService);
    private readonly linkFormService = inject(LinkFormService);
  

    selectedLink = input<Link | null>();

    onCloseDialog = output<void>();

    form = this.linkFormService.form;

    FormUtils = FormUtils;

    display = input.required<boolean>();

    pagesList = this.pageService.pagesListResource;

    LinkType = LinkType;

    linkTypes = computed(() => Object.values(linkTypeOptions));

    linkTargets = computed(() => [
        { label: 'Misma pestaña', value: false },
        { label: 'Nueva pestaña', value: true }
    ]);

    saveChanges() {
        const formValue = this.form.value;
        if (this.form.valid && formValue) {
            const createLinkData: CreateLink = {
                title: formValue.title!,
                type: formValue.type!,
                url: formValue.type === LinkType.EXTERNAL ? formValue.url! : null,
                pageId: formValue.type === LinkType.PAGE ? formValue.pageId! : null,
                openInNewTab: formValue.openInNewTab || false
            };

            if (this.selectedLink()) {
                this.linkService.updateLink(this.selectedLink()!.id, createLinkData).subscribe({
                    next: () => {
                     
                        this.linkFormService.form.reset();
                        this.linkFormService.clearTemporalValidators();
                        this.onCloseDialog.emit();
                    }
                });
                return;
            }

            this.linkService.createLink(createLinkData).subscribe({
                next: () => {
                 
                    this.linkFormService.form.reset();
                    this.linkFormService.clearTemporalValidators();
                    this.onCloseDialog.emit();
                }
            });
        }
    }
}
