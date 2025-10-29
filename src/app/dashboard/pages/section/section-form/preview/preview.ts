import { Section } from '@/shared/interfaces/section';
import { ImageType, SectionItem } from '@/shared/interfaces/section-item';
import { SectionType } from '@/shared/mappers/section.mapper';
import { JsonPipe } from '@angular/common';
import { Component, computed, input, linkedSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SectionContactUsItems } from '../../sections-list/section-contact-us-items/section-contact-us-items';
import { SectionHeroItems } from '../../sections-list/section-hero-items/section-hero-items';
import { SectionWhyUsItems } from '../../sections-list/section-why-us-items/section-why-us-items';
import { SectionValuePropositionItems } from '../../sections-list/section-value-proposition-items/section-value-proposition-items';
import { CashProcessingEquipmentForm } from '../../sections-list/section-item-form/cash-processing-equipment-form/cash-processing-equipment-form';
import { SectionCashProcessingEquipmentItems } from '../../sections-list/section-cash-processing-equipment-items/section-cash-processing-equipment-items';
import { SectionClientItems } from '../../sections-list/section-client-items/section-client-items';
import { SectionOurCompanyItems } from '../../sections-list/section-our-company-items/section-our-company-items';
import { SectionMachineItems } from '../../sections-list/section-machine-items/section-machine-items';
import { SectionContactTopBarItems } from '../../sections-list/section-contact-top-bar-items/section-contact-top-bar-items';
import { SectionMainNavigationMenuItems } from '../../sections-list/section-main-navigation-menu-items/section-main-navigation-menu-items';

@Component({
    selector: 'preview',
    imports: [
        SectionHeroItems,
        SectionWhyUsItems,
        SectionCashProcessingEquipmentItems,
        SectionValuePropositionItems,
        SectionClientItems,
        SectionOurCompanyItems,
        SectionMachineItems,
        SectionContactTopBarItems,
        SectionMainNavigationMenuItems,
        SectionContactUsItems,
        JsonPipe
    ],
    templateUrl: './preview.html'
})
export class Preview {
    level = input<'section' | 'item'>('section');
    section = input<Section | null>(null);
    currentSectionItem = input<SectionItem | null>(null);
    // readonly sectionFormService = inject(SectionFormService);
    form = input<FormGroup>();

    SectionType = SectionType;


    sectionPreview2 = linkedSignal(() => {
    const value = this.form()?.value;
    const section = this.section();
    const level = this.level();

    if (level === 'section') {
      return {
                id: 0,
                description: value.content ?? null,
                type: this.section()?.type ?? value.type!,
                items: this.section()?.items ?? [],
                title: value.title ?? '',
                image: this.getImage,
                link: null,
                menus:
                    value.menusIds?.map((menu: any) => {
                        return {
                            id: menu.data,
                            title: menu.label,
                            parent: menu.parent
                                ? {
                                      id: menu.parent.data,
                                      title: menu.parent.label
                                  }
                                : null
                        };
                    }) || [],
                textButton: value.showLink ? value.textButton || null : null,
                subtitle: value.subtitle ?? null,
                linkId: value.showLink ? value.linkId || null : null,
                pages: [],
                pivotPages: []
            };
    }

    // lógica item
    return {
      ...section!,
      items: this.currentSectionItem()
        ? this.updateItem(value)
        : [...(section?.items || []), this.addItem(value)]
    };
  });

  // TODO: Check this
  constructor() {
    this.form()?.valueChanges.subscribe(() => {
      // Trigger the linked signal to update its value
      console.log('Form value changed, updating sectionPreview2');
      this.sectionPreview2();
    });
  }

    get sectionPreview(): Section {
        const value = this.form()?.value;



        // console.log('CURRENT SECTION ITEM IN PREVIEW', this.level());

        if (this.level() === 'section') {
            return {
                id: 0,
                description: value.content ?? null,
                type: this.section()?.type ?? value.type!,
                items: this.section()?.items ?? [],
                title: value.title ?? '',
                image: this.getImage,
                link: null,
                menus:
                    value.menusIds?.map((menu: any) => {
                        return {
                            id: menu.data,
                            title: menu.label,
                            parent: menu.parent
                                ? {
                                      id: menu.parent.data,
                                      title: menu.parent.label
                                  }
                                : null
                        };
                    }) || [],
                textButton: value.showLink ? value.textButton || null : null,
                subtitle: value.subtitle ?? null,
                linkId: value.showLink ? value.linkId || null : null,
                pages: [],
                pivotPages: []
            };
        }

        return {
            ...this.section()!,
            items: this.currentSectionItem() ? this.updateItem(value) : [...(this.section()?.items || []), this.addItem(value)]
        };
    }

    
    


    private get getImage() {
        const value = this.form()?.value;
        const imageType = value.imageType;
        if (imageType === ImageType.LOCAL) {
            return value.imageFile ? this.getBlobUrl(value.imageFile) : null;
        } else if (imageType === ImageType.URL) {
            return value.imageUrl || null;
        } else {
            return value.currentImage || null;
        }
    }

    private get getImageBackground() {
        const value = this.form()?.value;
        const imageType = value.imageBackType;
        if (imageType === ImageType.LOCAL) {
            return value.imageBackFile ? this.getBlobUrl(value.imageBackFile) : null;
        } else if (imageType === ImageType.URL) {
            return value.imageBackUrl || null;
        } else {
            return value.currentImageBack || null;
        }
    }

    private addItem(value: any) {
        const newItem: SectionItem = {
            id: this.section()?.items?.length || 0,
            title: value.title ?? '',
            subtitle: value.subtitle ?? '',
            backgroundImage: this.getImageBackground,
            description: value.content ?? '',
            sectionId: this.section()?.id || 0,
            linkId: value.showLink ? value.linkId || null : null,
            textButton: value.showLink ? value.textButton || null : null,
            icon: value.icon || null,
            iconType: null,
            inputType: value.inputType || null,
            image: this.getImage,
            categoryId: null,
            order: 0,
            link: null,
            iconUrl: null

            // description: value.content ?? '',
            // icon: this.getImage,
            // image: this.getImage
        };

        return newItem;
    }

    get items() {
        if (this.level() === 'section') {
            return this.sectionPreview.items;
        } else {
            const item = this.sectionPreview.items.find((i) => i.id === this.currentSectionItem()?.id);
            return item ? [item] : [this.addItem(this.form()?.value)];
        }
    }

    get sectionCreate() {
        if (this.level() === 'section') {
            return this.sectionPreview;
        } else {
            return {
                ...this.sectionPreview,
                items: this.items
            };
        }
    }

    private updateItem(value: any) {
        return (
            this.section()?.items?.map((item) => {
                if (item.id === this.currentSectionItem()?.id) {
                    return {
                        ...item,
                        title: value.title ?? '',
                        subtitle: value.subtitle ?? '',
                        inputType: value.inputType || null,
                        image: this.getImage,
                        backgroundImage: this.getImageBackground,
                        textButton: value.showLink ? value.textButton || null : null,
                        linkId: value.showLink ? value.linkId || null : null,
                        description: value.content ?? '',
                        icon: value.icon || null
                        // description: value.content ?? '',
                        // icon: this.getImage,
                        // image: this.getImage
                    };
                }

                return item;
            }) || []
        );
    }
    private getBlobUrl(file: File): string {
        return URL.createObjectURL(file);
    }

    
}
