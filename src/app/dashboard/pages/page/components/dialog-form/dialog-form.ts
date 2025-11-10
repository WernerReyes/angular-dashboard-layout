import { PageService } from '@/dashboard/services/page.service';
import type { Page } from '@/shared/interfaces/page';
import { FormUtils } from '@/utils/form-utils';
import { Component, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { PageFormService } from '../../services/page-form.service';
import { CreatePage } from '@/dashboard/interfaces/page';

@Component({
    selector: 'dialog-form',
    imports: [DialogModule, ReactiveFormsModule, InputTextModule, MessageModule, TextareaModule, ButtonModule],
    templateUrl: './dialog-form.html'
})
export class DialogForm {
    readonly pageService = inject(PageService);
    private readonly pageFormService = inject(PageFormService);

    selectedPage = input<Page | null>();
    onCloseDialog = output<void>();
    display = input.required<boolean>();

    form = this.pageFormService.form;

    FormUtils = FormUtils;

    pagesList = this.pageService.pagesListResource;

    saveChanges() {
        const formValue = this.form.value;
        if (this.form.valid && formValue) {
            const pageData: CreatePage = {
                title: formValue.title?.trim()!,
                slug: formValue.slug?.trim()!,
                description: formValue.content?.trim() || ''
            };

            if (this.selectedPage()) {
                this.pageService.updatePage(this.selectedPage()!.id, pageData).subscribe({
                    next: () => {
                        this.onCloseDialog.emit();
                        this.pageFormService.reset();
                    }
                });
                return;
            }

            this.pageService.createPage(pageData).subscribe({
                next: () => {
                    this.onCloseDialog.emit();
                    this.pageFormService.reset();
                }
            });
        }
    }
}
