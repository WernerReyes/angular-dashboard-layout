import { CreateLink } from '@/dashboard/interfaces/link';
import { LinkService } from '@/dashboard/services/link.service';
import { PageService } from '@/dashboard/services/page.service';
import { FallBack } from '@/shared/components/error/fall-back/fall-back';
import { linkTypeOptions } from '@/shared/interfaces/menu';
import { LinkType } from '@/shared/mappers/link.mapper';
import { MessageService } from '@/shared/services/message.service';
import { FormUtils } from '@/utils/form-utils';
import { JsonPipe } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';
import { LinkFormService } from '../../services/link-form.service';
import type { Link } from '@/shared/interfaces/link';

@Component({
    selector: 'link-dialog-form',
    imports: [DialogModule, FallBack, ReactiveFormsModule, JsonPipe, InputTextModule, MessageModule, SkeletonModule, SelectModule, SelectButtonModule, ButtonModule],
    templateUrl: './dialog-form.html'
})
export class DialogForm {
    private readonly pageService = inject(PageService);
    private readonly linkService = inject(LinkService);
    private readonly linkFormService = inject(LinkFormService);
    private readonly messageService = inject(MessageService);

    selectedLink = input.required<Link | null>();

    closeDialog = output<void>();

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

    isEditMode = false;

    // private populateForm = effect(() => {
    //     const link = this.selectedLink();
    //     console.log('Selected Link changed:', link);
    //     if (link) {
    //         this.linkFormService.populateForm(link);
    //     }
    // });

    constructor() {
      if (this.isEditMode) return;
        // Effect que solo se ejecuta al abrir el diálogo
        effect(() => {
            // const isVisible = this.display();
            const link = this.selectedLink();

            if (link) {
                console.log('Dialog opened with link, populating form');
                this.linkFormService.populateForm(link);
                this.isEditMode = true;
            }
        });
    }

    createLink() {
        const formValue = this.form.value;
        if (this.form.valid && formValue) {
            const createLinkData: CreateLink = {
                title: formValue.title!,
                type: formValue.type!,
                url: formValue.type === LinkType.EXTERNAL ? formValue.url! : null,
                pageId: formValue.type === LinkType.PAGE ? formValue.pageId! : null,
                openInNewTab: formValue.openInNewTab || false
            };
            this.linkService.createLink(createLinkData).subscribe({
                next: () => {
                    this.messageService.setSuccess('Enlace creado con éxito');
                    this.linkFormService.form.reset();
                    this.linkFormService.clearTemporalValidators();
                    this.closeDialog.emit();
                }
            });
        }
    }
}
