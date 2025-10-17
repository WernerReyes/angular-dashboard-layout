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
import { JsonPipe } from '@angular/common';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';

@Component({
    selector: 'link-dialog-form',
    imports: [JsonPipe, DialogModule, ErrorBoundary, ReactiveFormsModule, FileUpload,  InputTextModule, MessageModule, SkeletonModule, SelectModule, SelectButtonModule, ButtonModule],
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

    onFileSelect(event: FileSelectEvent) {
        console.log(event);
        const file = event.currentFiles[0];

        if (file) {
            this.form.patchValue({ file: file as any });
            this.form.get('file')?.markAsTouched();
            }
        }

    saveChanges() {
       
        const formValue = this.form.value;
        Object.keys(this.form.controls).forEach((key) => {
            const control = this.form.get(key);
            console.log(key, control?.errors);
        });
        if (this.form.valid && formValue) {
            const createLinkData: CreateLink = {
                title: formValue.title!,
                type: formValue.type!,
                url: formValue.type === LinkType.EXTERNAL ? formValue.url! : null,
                pageId: formValue.type === LinkType.PAGE ? formValue.pageId! : null,
                openInNewTab: formValue.openInNewTab || false,
                file: formValue.type === LinkType.FILE ? formValue.file! : null
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
