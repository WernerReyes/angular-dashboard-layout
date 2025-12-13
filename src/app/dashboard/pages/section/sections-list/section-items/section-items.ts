import type { Section } from '@/shared/interfaces/section';
import { SectionType } from '@/shared/mappers/section.mapper';
import { Component, input, output, signal, ViewChild } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { SectionHeroItems } from '../section-hero-items/section-hero-items';
import { SectionWhyUsItems } from '../section-why-us-items/section-why-us-items';
import { SectionValuePropositionItems } from '../section-value-proposition-items/section-value-proposition-items';
import { SectionClientItems } from '../section-client-items/section-client-items';
import { SectionOurCompanyItems } from '../section-our-company-items/section-our-company-items';
import { SectionMachineItems } from '../section-machine-items/section-machine-items';
import { SectionContactTopBarItems } from '../section-contact-top-bar-items/section-contact-top-bar-items';
import { SectionMainNavigationMenuItems } from '../section-main-navigation-menu-items/section-main-navigation-menu-items';
import { SectionCtaBannerItems } from '../section-cta-banner-items/section-cta-banner-items';
import { SectionSolutionsOverviewItems } from '../section-solutions-overview-items/section-solutions-overview-items';
import { SectionMissionVisionItems } from '../section-mission-vision-items/section-mission-vision-items';
import { SectionContactUsItems } from '../section-contact-us-items/section-contact-us-items';
import { SectionFooterItems } from '../section-footer-items/section-footer-items';

import type { SectionItem as ISectionItem } from '@/shared/interfaces/section-item';
import { SectionCashProcessingEquipmentItems } from '../section-cash-processing-equipment-items/section-cash-processing-equipment-items';
import { SectionAdvantagesItems } from '../section-advantages-items/section-advantages-items';
import { SectionSupportMaintenanceItems } from '../section-support-maintenance-items/section-support-maintenance-items';
import { MenuItemCommandEvent } from 'primeng/api';
import { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { SectionOperacionalBenefitsItems } from '../section-operacional-benefits-items/section-operacional-benefits-items';
import { SectionMachineDetailsItems } from '../section-machine-details-items/section-machine-details-items';
import { SectionMachinesCatalogItems } from '../section-machines-catalog-items/section-machines-catalog-items';
import { SectionFullMaintenancePlanItems } from '../section-full-maintenance-plan-items/section-full-maintenance-plan-items';
import { SectionPreventiveCorrectiveMaintenanceItems } from '../section-preventive-corrective-maintenance-items/section-preventive-corrective-maintenance-items';
import { SectionSupportWidgetItems } from '../section-support-widget-items/section-support-widget-items';

type DeleteSectionItemParams = {
    id: number;
    sectionId: number;
};


export type DeleteSectionItemFunction = (event: Event, params: DeleteSectionItemParams, accept?: () => void, reject?: () => void) => void;
@Component({
    selector: 'section-items',
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
        SectionPreventiveCorrectiveMaintenanceItems,
        SectionSupportWidgetItems,
        PanelModule,
        ContextMenuCrud
    ],
    templateUrl: './section-items.html'
})
export class SectionItems {
    section = input.required<Section>();
    deleteItemConfirmation = input.required<DeleteSectionItemFunction>();
    duplicateSectionItem = input.required<(sectionItem: ISectionItem) => void>();
    onSelectSectionItem = output<ISectionItem>();

    @ViewChild(ContextMenuCrud) contextMenu!: ContextMenuCrud<ISectionItem>;

    SectionType = SectionType;

    selectedItem = signal<ISectionItem | null>(null);

    open = (item: ISectionItem) => {
        this.onSelectSectionItem.emit(item);
    };

    edit = () => {
        this.onSelectSectionItem.emit(this.selectedItem()!);
    }

    delete = (event: MenuItemCommandEvent) => {
        this.deleteItemConfirmation()(
            event.originalEvent!,
            {
                id: this.selectedItem()!.id,
                sectionId: this.selectedItem()!.sectionId
            },
            () => {
                this.selectedItem.set(null);
            }
        );
    }

    duplicate = () => {
        this.duplicateSectionItem()(this.selectedItem()!);
    }

}
