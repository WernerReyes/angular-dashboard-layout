import { Component, inject, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { SectionItemFormService } from '../../services/section-item-form.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageType, imageTypeOptions, SectionItem } from '@/shared/interfaces/section-item';
import { FormUtils } from '@/utils/form-utils';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { SelectModule } from 'primeng/select';
import { LinkService } from '@/dashboard/services/link.service';
import { FilterLinksByTypePipe } from '../../pipes/filter-links-by-type-pipe';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ButtonModule } from 'primeng/button';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { Section } from '@/shared/interfaces/section';
import { SelectButtonModule } from 'primeng/selectbutton';
import { JsonPipe } from '@angular/common';
import { CreateSectionItem } from '@/dashboard/interfaces/section-title';
import { SectionItemService } from '@/dashboard/services/section-item.service';
interface UploadEvent {
    originalEvent: Event;
    files: File[];
}
@Component({
    selector: 'section-item-form',
    imports: [
        JsonPipe,
        ErrorBoundary,
        FilterLinksByTypePipe,
        ReactiveFormsModule,
        FileUploadModule,
        DialogModule,
        InputTextModule,
        SelectButtonModule,
        SelectModule,
        ToggleSwitchModule,
        ButtonModule,
        ToggleButtonModule,
        TextareaModule,
        MessageModule
    ],
    templateUrl: './section-item-form.html'
})
export class SectionItemForm {
    private readonly sectionItemFormService = inject(SectionItemFormService);
    private readonly sectionItemService = inject(SectionItemService);
    private readonly linkService = inject(LinkService);
    form = this.sectionItemFormService.form;
    linksList = this.linkService.linksListResource;

    onCloseDialog = output<void>();
    display = input.required<boolean>();
    selectedSectionItem = input<SectionItem | null>();
    selectedSection = input<Section | null>(null);

    FormUtils = FormUtils;

    uploadedFiles: any[] = [];

    saveChanges() {
        if (this.form.valid) {
            const formValue = this.form.value;
            const sectionItemData: CreateSectionItem = {
                title: formValue.title!,
                subtitle: formValue.subtitle || null,
                content: formValue.content || null,
                linkTexted: formValue.showLink ? formValue.textButton || null : null,
                linkId: formValue.typeLink ? formValue.linkId || null : null,
                sectionId: this.selectedSection()?.id || 0,
                fileImage: formValue.imageType === ImageType.LOCAL ? (formValue.imageFile as any) : null,
                imageUrl: formValue.imageType === ImageType.URL ? formValue.imageUrl || null : null,
                sectionType: this.selectedSection()!.type
            };

            if (this.selectedSectionItem()) {
                return;
            }

            console.log(sectionItemData);

            this.sectionItemService.createSectionItem(sectionItemData).subscribe({
                next: () => {
                    this.onCloseDialog.emit();
                },
                error: (error) => {
                    console.error('Error creating section item:', error);
                }
            });
        }
    }

    imagesTypeOptions = Object.values(imageTypeOptions);

    ImageType = ImageType;

    onFileSelect(event: FileSelectEvent) {
        const file = event.files[0];
        console.log(file);
        if (file) {
            this.form.patchValue({ imageFile: file as any });
            this.form.get('imageFile')?.markAsTouched();
        }
    }

    onUpload(event: any) {
        event = event as UploadEvent;
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }

        console.log(this.uploadedFiles);

        // this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    }
}
