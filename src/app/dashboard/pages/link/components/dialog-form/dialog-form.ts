import { CreateLink } from '@/dashboard/interfaces/link';
import { LinkService } from '@/dashboard/services/link.service';
import { PageService } from '@/dashboard/services/page.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { linkTypeOptions, type Link } from '@/shared/interfaces/link';
import { LinkType } from '@/shared/mappers/link.mapper';
import { FormUtils } from '@/utils/form-utils';
import { Component, computed, effect, inject, input, output } from '@angular/core';
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
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'link-dialog-form',
    imports: [
        // JsonPipe, 
        DialogModule, ErrorBoundary, ReactiveFormsModule, FileUpload, InputTextModule, MessageModule, SkeletonModule, SelectModule, SelectButtonModule, ButtonModule],
    templateUrl: './dialog-form.html'
})
export class DialogForm {
    private readonly pageService = inject(PageService);
    readonly linkService = inject(LinkService);
    private readonly linkFormService = inject(LinkFormService);

    pagesList = this.pageService.pagesListResource;
    form = this.linkFormService.form;
    FormUtils = FormUtils;
    LinkType = LinkType;
    linkTypes = Object.values(linkTypeOptions);
    linkTargets = [
        { label: 'Misma pestaña', value: false },
        { label: 'Nueva pestaña', value: true }
    ];

    selectedLink = input<Link | null>();
    onCloseDialog = output<void>();
    display = input.required<boolean>();

    private pageId = toSignal(this.form.get('pageId')!.valueChanges, { initialValue: this.form.get('pageId')!.value });
    private type = toSignal(this.form.get('type')!.valueChanges, { initialValue: this.form.get('type')!.value });

    private setDefaultLinkTitle = effect(() => {
        if (this.selectedLink()) return;
        const type = this.type();
        const currentTitle = this.form.get('title')!;
        // if (!currentTitle || currentTitle.value.trim() === '') {
            if (type === LinkType.PAGE) {
                const pageId = this.pageId();
                const page = this.pagesList.hasValue() ? this.pagesList.value().find((p) => p.id === pageId) : null;
                if (page) {
                    currentTitle.setValue(page.title);
                }
            }
        // }
    });

    onFileSelect(event: FileSelectEvent) {
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
