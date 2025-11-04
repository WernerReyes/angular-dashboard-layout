import { Section } from '@/shared/interfaces/section';
import { ImageType, SectionItem } from '@/shared/interfaces/section-item';
import { SectionType } from '@/shared/mappers/section.mapper';
import { JsonPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SectionCashProcessingEquipmentItems } from '../../sections-list/section-cash-processing-equipment-items/section-cash-processing-equipment-items';
import { SectionClientItems } from '../../sections-list/section-client-items/section-client-items';
import { SectionContactTopBarItems } from '../../sections-list/section-contact-top-bar-items/section-contact-top-bar-items';
import { SectionContactUsItems } from '../../sections-list/section-contact-us-items/section-contact-us-items';
import { SectionCtaBannerItems } from '../../sections-list/section-cta-banner-items/section-cta-banner-items';
import { SectionHeroItems } from '../../sections-list/section-hero-items/section-hero-items';
import { SectionMachineItems } from '../../sections-list/section-machine-items/section-machine-items';
import { SectionMainNavigationMenuItems } from '../../sections-list/section-main-navigation-menu-items/section-main-navigation-menu-items';
import { SectionOurCompanyItems } from '../../sections-list/section-our-company-items/section-our-company-items';
import { SectionSolutionsOverviewItems } from '../../sections-list/section-solutions-overview-items/section-solutions-overview-items';
import { SectionValuePropositionItems } from '../../sections-list/section-value-proposition-items/section-value-proposition-items';
import { SectionWhyUsItems } from '../../sections-list/section-why-us-items/section-why-us-items';
import { SectionFormService } from '../../services/section-form.service';
import { SectionItemFormService } from '../../services/section-item-form.service';
import { SectionMissionVisionItems } from '../../sections-list/section-mission-vision-items/section-mission-vision-items';
import { SectionFooterItems } from '../../sections-list/section-footer-items/section-footer-items';
import { SectionAdvantagesItems } from '../../sections-list/section-advantages-items/section-advantages-items';
import { SectionSupportMaintenanceItems } from '../../sections-list/section-support-maintenance-items/section-support-maintenance-items';
import { MachineService } from '@/dashboard/services/machine.service';
import type { TreeNode } from 'primeng/api';
import type { Menu } from '@/shared/interfaces/menu';
import { SectionOperacionalBenefitsItems } from '../../sections-list/section-operacional-benefits-items/section-operacional-benefits-items';
import { SectionMachineDetailsItems } from '../../sections-list/section-machine-details-items/section-machine-details-items';
import { SectionMachinesCatalogItems } from '../../sections-list/section-machines-catalog-items/section-machines-catalog-items';
import { SectionFullMaintenancePlanItems } from '../../sections-list/section-full-maintenance-plan-items/section-full-maintenance-plan-items';

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
        SectionCtaBannerItems,
        SectionSolutionsOverviewItems,
        SectionMissionVisionItems,
        SectionContactUsItems,
        SectionFooterItems,
        SectionAdvantagesItems,
        SectionSupportMaintenanceItems,
        SectionOperacionalBenefitsItems,
        SectionMachineDetailsItems,
        SectionMachinesCatalogItems,
        SectionFullMaintenancePlanItems,
        JsonPipe
    ],
    templateUrl: './preview.html'
})
export class Preview {
    private readonly sectionFormService = inject(SectionFormService);
    private readonly sectionItemFormService = inject(SectionItemFormService);
    private readonly machineService = inject(MachineService);

    level = input<'section' | 'item'>('section');
    section = input<Section | null>(null);
    currentSectionItem = input<SectionItem | null>(null);

    SectionType = SectionType;

    sectionFormValue = toSignal(this.sectionFormService.form.valueChanges, {
        initialValue: this.sectionFormService.form.value
    });

    formValue = toSignal(this.sectionItemFormService.form.valueChanges, {
        initialValue: this.sectionItemFormService.form.value
    });

    sectionPreview = computed<Section>(() => {
        // if (this.level() === 'section') {
        //     return this.sectionPreviewDefault();
        // }

        if (this.level() === 'item') {
            const value = this.formValue();
            return {
                ...this.section()!,
                items: this.currentSectionItem() ? this.updateItem(value) : [...(this.section()?.items || []), this.addItem(value)]
            };
        }

        return this.sectionPreviewDefault();
    });

    items = computed(() => {
        if (this.level() === 'section') {
            return this.sectionPreview().items;
        } else {
            const item = this.sectionPreview().items.find((i) => i.id === this.currentSectionItem()?.id);
            return item ? [item] : [this.addItem(this.formValue())];
        }
    });

    sectionCreate = computed(() => {
        if (this.level() === 'section') {
            return this.sectionPreview();
        } else {
            return {
                ...this.sectionPreview(),
                items: this.items()
            };
        }
    });

    private sectionPreviewDefault() {
        const value = this.sectionFormValue() as any;
        const section = this.section();
        return {
            id: 0,
            description: value.content ?? null,
            type: this.section()?.type ?? value.type!,
            items: this.section()?.items ?? [],
            title: value.title ?? '',
            image: this.getImage(value),
            backgroundImage: this.getImageBackground(value),
            link: null,
            linksId: section?.linkId || null,
            textButton: value.showLink ? value.textButton || section?.textButton : null,
            menus: value.menusIds?.map((menu: any) => this.buildRecursiveNode(menu)) || [],
            // textButton: value.showLink ? value.textButton || null : null,
            subtitle: value.subtitle ?? null,
            machines: this.getMachines(value).filter((machine) => (value.machinesIds || []).includes(machine.id)),
            linkId: value.showLink ? value.linkId || null : null,
            pages: [],
            pivotPages: [],
            additionalInfoList: (value?.additionalInfoList?.length ?? 0 > 0) ? value.additionalInfoList! : null,

            icon: value.icon || null,
            iconType: value.iconType || null,
            iconUrl: value.iconFile ? this.getBlobUrl(value.iconFile) : section?.iconUrl || ''
            

        
        };
    }

    private buildRecursiveNode(menu: TreeNode): Partial<Menu> {
        const node: any = {
            id: menu.data,
            title: menu.label as string,
            parentId: menu.parent ? (menu.parent.data as number) : null,
            parent: menu.parent ? this.buildRecursiveNode(menu.parent) : null
        };

        if (menu.parent) {
            node.parent = this.buildRecursiveNode(menu.parent); // llamada recursiva
        }

        return node;
    }

    private getMachines(value: any) {
        const sectionType = this.section()?.type ?? value?.type;

        if (sectionType !== SectionType.MACHINE && sectionType !== SectionType.MACHINE_DETAILS && sectionType !== SectionType.MACHINES_CATALOG && sectionType !== SectionType.CASH_PROCESSING_EQUIPMENT) {
            return [];
        }

        console.log('GET MACHINES', this.section()?.type);
        const machines = this.machineService.machinesListRs;
        return machines.hasValue() ? machines.value() : [];
    }

    private getImage(value: any, item?: SectionItem): string {
        const imageType = value.imageType;
        if (imageType === ImageType.LOCAL) {
            return value.imageFile ? this.getBlobUrl(value.imageFile) : item?.image || '';
        } else if (imageType === ImageType.URL) {
            return value.imageUrl || item?.image || '';
        } else {
            return value.currentImage || '';
        }
    }

    private getImageBackground(value: any, item?: SectionItem): string {
        const imageType = value.imageBackType;
        if (imageType === ImageType.LOCAL) {
            return value.imageBackFile ? this.getBlobUrl(value.imageBackFile) : item?.backgroundImage || '';
        } else if (imageType === ImageType.URL) {
            return value.imageBackUrl || item?.backgroundImage || '';
        } else {
            return value.currentImageBack || item?.backgroundImage || '';
        }
    }

    private addItem(value: any) {
        const newItem: SectionItem = {
            id: this.section()?.items?.length || 0,
            title: value.title ?? '',
            subtitle: value.subtitle ?? '',
            backgroundImage: this.getImageBackground(value),
            description: value.content ?? '',
            sectionId: this.section()?.id || 0,
            linkId: value.showLink ? value.linkId || null : null,
            textButton: value.showLink ? value.textButton || null : null,
            icon: value.icon || null,
            iconType: value.iconType || null,
            inputType: value.inputType || null,
            image: this.getImage(value),
            additionalInfoList: value.additionalInfoList || null,
            // categoryId: null,
            order: 0,
            link: null,
            iconUrl: value.iconFile ? this.getBlobUrl(value.iconFile) : ''

            // description: value.content ?? '',
            // icon: this.getImage,
            // image: this.getImage
        };

        return newItem;
    }

    private updateItem(value: any) {
        return (
            this.section()?.items?.map((item) => {
                if (item.id === this.currentSectionItem()?.id) {
                    return {
                        ...item,
                        link: null,
                        title: value.title || item.title,
                        subtitle: value.subtitle || item.subtitle,
                        inputType: value.inputType || item.inputType,
                        image: this.getImage(value, item),
                        backgroundImage: this.getImageBackground(value, item),
                        textButton: value.showLink ? value.textButton || item.textButton : null,
                        linkId: value.showLink ? value.linkId || item.linkId : null,
                        description: value.content || item.description,
                        icon: value.icon || item.icon,
                        iconType: value.iconType || item.iconType,
                        additionalInfoList: value.additionalInfoList || item.additionalInfoList,
                        iconUrl: value.iconFile ? this.getBlobUrl(value.iconFile) : item.iconUrl || ''
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
