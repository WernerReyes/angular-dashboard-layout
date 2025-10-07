import { Component, inject, input, model, output } from '@angular/core';
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
import { type FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { Section } from '@/shared/interfaces/section';
import { SelectButtonModule } from 'primeng/selectbutton';
import { JsonPipe } from '@angular/common';
import { CreateSectionItem } from '@/dashboard/interfaces/section-item';
import { SectionItemService } from '@/dashboard/services/section-item.service';
import { ImageModule } from 'primeng/image';
import { ImageError } from '@/shared/components/error/image/image';
import { FileUpload } from '../file-upload/file-upload';

@Component({
    selector: 'section-item-form',
    imports: [
        JsonPipe,
        ImageError,
        FileUpload,
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
        ImageModule,
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
    selectedSectionItem = model<SectionItem | null>(null);
    selectedSection = input<Section | null>(null);

    FormUtils = FormUtils;

    saveChanges() {
        if (this.form.valid) {
            const formValue = this.form.value;
            const sectionItemData: CreateSectionItem = {
                title: formValue.title!,
                subtitle: formValue.subtitle || null,
                content:  formValue.content || null,
                linkTexted: formValue.showLink ? formValue.textButton || null : null,
                linkId: formValue.showLink && formValue.typeLink ? formValue.linkId || null : null,
                sectionId: this.selectedSection()?.id || 0,
                fileImage: formValue.imageType === ImageType.LOCAL ? (formValue.imageFile as any) : null,
                backgroundFileImage: formValue.imageBackType === ImageType.LOCAL ? (formValue.imageBackFile as any) : null,
                imageUrl: formValue.imageType === ImageType.URL ? formValue.imageUrl || null : null,
                backgroundImageUrl: formValue.imageBackType === ImageType.URL ? formValue.imageBackUrl || null : null,
                sectionType: this.selectedSection()!.type
            };

            console.log('Submitting section item data:', sectionItemData);

            if (this.selectedSectionItem()) {
                this.sectionItemService.updateSection(this.selectedSectionItem()!.id!, sectionItemData).subscribe({
                    next: () => {
                        this.onCloseDialog.emit();
                        this.sectionItemFormService.reset();
                        this.selectedSectionItem.set(null);
                    },
                    error: (error) => {
                        console.error('Error updating section item:', error);
                    }
                });
                return;
            }

            this.sectionItemService.createSectionItem(sectionItemData).subscribe({
                next: () => {
                    this.onCloseDialog.emit();
                    this.sectionItemFormService.reset();
                },
                error: (error) => {
                    console.error('Error creating section item:', error);
                }
            });
        }
    }

    imagesTypeOptions = Object.values(imageTypeOptions);

    ImageType = ImageType;

    closeDialog() {
        this.onCloseDialog.emit();
        this.sectionItemFormService.reset();
        this.selectedSectionItem.set(null);
    }

    onFileSelect(event: FileSelectEvent) {
        const file = event.files[0];
        if (file) {
            this.form.patchValue({ imageFile: file as any });
            this.form.get('imageFile')?.markAsTouched();
        }
    }
}
