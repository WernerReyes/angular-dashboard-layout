import { CreateSection } from '@/dashboard/interfaces/section';
import { LinkService } from '@/dashboard/services/link.service';
import { SectionService } from '@/dashboard/services/section.service';
import { sectionTypesOptions, type Section } from '@/shared/interfaces/section';
import { ImageType } from '@/shared/interfaces/section-item';
import { LinkType } from '@/shared/mappers/link.mapper';
import { SectionMode, SectionType } from '@/shared/mappers/section.mapper';
import { FormUtils } from '@/utils/form-utils';
import { KeyValuePipe } from '@angular/common';
import { Component, computed, inject, input, model, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CommonInputs } from '../components/common-inputs/common-inputs';
import { FileUpload } from '../components/file-upload/file-upload';
import { ShowLinkSwitch } from '../components/show-link-switch/show-link-switch';
import { SectionFormService } from '../services/section-form.service';
import { NavigationMenuForm } from './navigation-menu-form/navigation-menu-form';
import { Preview } from './preview/preview';
import { WhyUsForm } from './why-us-form/why-us-form';

import { IconUpload } from '../components/icon-upload/icon-upload';
import { InputList } from '../components/input-list/input-list';
import { SelectMachine } from '../components/select-machine/select-machine';
import { VideoUpload } from '../components/video-upload/video-upload';

@Component({
    selector: 'section-form',
    imports: [
        // JsonPipe,
        CommonInputs,
        ShowLinkSwitch,
        FileUpload,
        WhyUsForm,
        NavigationMenuForm,
        ReactiveFormsModule,
        InputTextModule,
        KeyValuePipe,
        SelectMachine,
        IconUpload,
        VideoUpload,
        Preview,
        InputList,
        ToggleSwitchModule,
        TabsModule,
        TextareaModule,
        SelectModule,
        DialogModule,
        MessageModule,
        ButtonModule,
        ToggleButtonModule
    ],
    templateUrl: './section-form.html'
})
export class SectionForm {
    private readonly linkService = inject(LinkService);
    private readonly sectionService = inject(SectionService);
    private readonly sectionFormService = inject(SectionFormService);

    onCloseDialog = output<void>();
    display = input.required<boolean>();
    selectedSection = model<Section | null>();
    selectedPageId = input<number | null>(null);
    mode = input.required<SectionMode>();

    loading = computed(() => this.sectionService.isCreating() || this.sectionService.isUpdating());

    form = this.sectionFormService.form;

    linksList = this.linkService.linksListResource;

    sectionTypesOptions = sectionTypesOptions;

    FormUtils = FormUtils;
    SectionType = SectionType;
    LinkType = LinkType;
    SectionMode = SectionMode;

    closeDialog() {
        this.onCloseDialog.emit();
        this.sectionFormService.reset();
        this.selectedSection.set(null);
        const type = this.form.controls['type'];
        if (type.disabled) {
            type.enable();
        }
    }

    saveChanges() {
        
        if (this.form.valid) {
            const formValue = this.form.value;

            const sectionData: CreateSection = {
                type: formValue.type!,
                title: formValue.title!,
                subtitle: formValue.subtitle || null,
                description: formValue.content || null,
                textButton: this.setTextButton(this.selectedSection()!, formValue),
                extraTextButton: formValue.showExtraLink ? formValue.extraTextButton || null : null,
                linkId: formValue.showLink ? (formValue.linkId as any) : null,
                extraLinkId: formValue.showExtraLink ? (formValue.extraLinkId as any) : null,
                active: formValue.active!,
                pageId: this.selectedPageId(),
                fileImage: formValue.imageType === ImageType.LOCAL ? (formValue.imageFile as any) : null,
                imageUrl: formValue.imageType === ImageType.URL ? formValue.imageUrl || null : null,
                menusIds: formValue.menusIds ? formValue.menusIds.map(({ data }) => Number(data)) : [],
                mode: this.mode(),
                machinesIds: formValue.machinesIds ? formValue.machinesIds : [],

                fileIcon: formValue.iconFile as any,
                fileIconUrl: formValue.currentIconUrl || null,
                icon: formValue.icon || null,
                iconType: formValue.iconType!,

                fileVideo: formValue.videoFile,

             

                additionalInfoList: (formValue?.additionalInfoList?.length ?? 0 > 0) ? formValue.additionalInfoList! : null
            };

            if (this.selectedSection()) {
                this.sectionService
                    .updateSection(this.selectedSection()!.id, {
                        ...sectionData,
                        type: this.selectedSection()!.type,
                        currentImageUrl: formValue.currentImage || null,
                        currentVideoUrl: formValue.currentVideo || null
                    }, this.mode())
                    .subscribe({
                        next: () => {
                            this.closeDialog();
                        }
                    });
                return;
            }

            this.sectionService.createSection(sectionData, this.mode()).subscribe({
                next: () => {
                    this.closeDialog();
                }
            });
        }
    }

     private setTextButton(section: Section | null, value: any) {
        const type = section ? section.type : value.type;
        if (type === SectionType.CONTACT_US || type === SectionType.SUPPORT_WIDGET) {
            return value.textButton || section?.textButton || null;
        }

        if (value.showLink) {
            return value.textButton || section?.textButton;
        }

        return null;
    }

}
