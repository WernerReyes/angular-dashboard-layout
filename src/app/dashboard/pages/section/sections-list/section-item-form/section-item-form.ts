import { CreateSectionItem } from '@/dashboard/interfaces/section-item';
import { LinkService } from '@/dashboard/services/link.service';
import { SectionItemService } from '@/dashboard/services/section-item.service';
import { Section } from '@/shared/interfaces/section';
import { ImageType, imageTypeOptions, SectionItem } from '@/shared/interfaces/section-item';
import { SectionType } from '@/shared/mappers/section.mapper';
import { FormUtils } from '@/utils/form-utils';
import { JsonPipe } from '@angular/common';
import { Component, inject, input, model, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CommonInputs } from '../../components/common-inputs/common-inputs';
import { FileUpload } from '../../components/file-upload/file-upload';
import { IconUpload } from '../../components/icon-upload/icon-upload';
import { ShowLinkSwitch } from '../../components/show-link-switch/show-link-switch';
import { SectionItemFormService } from '../../services/section-item-form.service';
import { ContactUsForm } from './contact-us-form/contact-us-form';
import { HeroForm } from './hero-form/hero-form';
import { Preview } from '../../section-form/preview/preview';
import { InputList } from '../../components/input-list/input-list';

@Component({
    selector: 'section-item-form',
    imports: [
        // JsonPipe,
        Preview,
        ContactUsForm,
        CommonInputs,
        IconUpload,
        ShowLinkSwitch,
        ShowLinkSwitch,
        HeroForm,
        FileUpload,
        ReactiveFormsModule,
        FileUploadModule,
        DialogModule,
        InputTextModule,
        SelectButtonModule,
        InputList,
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
    loading = this.sectionItemService.loading;

    onCloseDialog = output<void>();
    display = input.required<boolean>();
    selectedSectionItem = model<SectionItem | null>(null);
    selectedSection = input<Section | null>(null);

    FormUtils = FormUtils;
    SectionType = SectionType;

    saveChanges() {
        if (this.form.valid) {
            const formValue = this.form.value;
            const sectionItemData: CreateSectionItem = {
                title: formValue.title!,
                subtitle: formValue.subtitle || null,
                content: formValue.content || null,
                linkTexted: formValue.showLink ? formValue.textButton || null : null,
                linkId: formValue.showLink ? formValue.linkId || null : null,
                sectionId: this.selectedSection()?.id || 0,
                fileImage: formValue.imageType === ImageType.LOCAL ? (formValue.imageFile as any) : null,
                imageUrl: formValue.imageType === ImageType.URL ? formValue.imageUrl || null : null,
                backgroundFileImage: formValue.imageBackType === ImageType.LOCAL ? (formValue.imageBackFile as any) : null,
                backgroundImageUrl: formValue.imageBackType === ImageType.URL ? formValue.imageBackUrl || null : null,
                // categoryId: formValue.categoryId || null,
                inputType: formValue.inputType || null,

                fileIcon: formValue.iconFile as any,
                fileIconUrl: formValue.currentIconUrl || null,
                icon: formValue.icon || null,
                iconType: formValue.iconType!,

                sectionType: this.selectedSection()!.type,

                additionalInfoList: (formValue?.additionalInfoList?.length ?? 0 > 0) ? formValue.additionalInfoList! : null
            };

            console.log('Submitting section item data:', {
                data: formValue,
                isUpdate: !!this.selectedSectionItem()
            });

            if (this.selectedSectionItem()) {
                this.sectionItemService
                    .updateSection(this.selectedSectionItem()!.id, {
                        ...sectionItemData,
                        currentImageUrl: formValue.currentImage || null,
                        currentBackgroundImageUrl: formValue.currentImageBack || null
                    })
                    .subscribe({
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
}
