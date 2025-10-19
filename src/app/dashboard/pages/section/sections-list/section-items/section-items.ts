import { Section } from '@/shared/interfaces/section';
import { SectionType } from '@/shared/mappers/section.mapper';
import { Component, input, output } from '@angular/core';
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
import { DeleteSectionItemFunction } from '../sections-list';
import { SectionItem as ISectionItem } from '@/shared/interfaces/section-item';
import { SectionItem } from '../section-item/section-item';
import { SectionCashProcessingEquipmentItems } from '../section-cash-processing-equipment-items/section-cash-processing-equipment-items';

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
        SectionItem,
        PanelModule
    ],
    templateUrl: './section-items.html'
})
export class SectionItems {
    section = input.required<Section>();
    deleteItemConfirmation = input.required<DeleteSectionItemFunction>();
    onSelectSectionItem = output<ISectionItem>();

    SectionType = SectionType;

    delete = () => {
        this.deleteItemConfirmation().bind(this);
    };

    open = (item: ISectionItem) => {
        this.onSelectSectionItem.emit(item);
    };
}
