import { FilterSectionsByPagePipe } from '@/dashboard/pipes/filter-sections-by-page-pipe';
import { SectionItemService } from '@/dashboard/services/section-item.service';
import { SectionService } from '@/dashboard/services/section.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import { Page } from '@/shared/interfaces/page';
import { Section, sectionStatusOptions, sectionTypesOptions } from '@/shared/interfaces/section';
import type { SectionItem as ISectionItem } from '@/shared/interfaces/section-item';
import { SectionType } from '@/shared/mappers/section.mapper';
import { MessageService } from '@/shared/services/message.service';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, computed, inject, input, linkedSignal, model, output, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItemCommandEvent } from 'primeng/api';
import { Badge, BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { FieldsetModule } from 'primeng/fieldset';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { SectionFormService } from '../services/section-form.service';
import { SectionItemFormService } from '../services/section-item-form.service';
import { SectionCashProcessingEquipmentItems } from './section-cash-processing-equipment-items/section-cash-processing-equipment-items';
import { SectionClientItems } from './section-client-items/section-client-items';
import { SectionHeroItems } from './section-hero-items/section-hero-items';
import { SectionItemForm } from './section-item-form/section-item-form';
import { SectionItem } from './section-item/section-item';
import { SectionMachineItems } from './section-machine-items/section-machine-items';
import { SectionOurCompanyItems } from './section-our-company-items/section-our-company-items';
import { SectionValuePropositionItems } from './section-value-proposition-items/section-value-proposition-items';
import { SectionWhyUsItems } from './section-why-us-items/section-why-us-items';
import { SectionContactTopBarItems } from './section-contact-top-bar-items/section-contact-top-bar-items';
import { SectionMainNavigationMenuItems } from './section-main-navigation-menu-items/section-main-navigation-menu-items';
import { SectionCtaBannerItems } from './section-cta-banner-items/section-cta-banner-items';
import { SectionSolutionsOverviewItems } from './section-solutions-overview-items/section-solutions-overview-items';
import { SectionMissionVisionItems } from './section-mission-vision-items/section-mission-vision-items';
import { SectionContactUsItems } from './section-contact-us-items/section-contact-us-items';
import { SectionFooterItems } from './section-footer-items/section-footer-items';
import { PageService } from '@/dashboard/services/page.service';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { ContextMenuCrud } from '../components/context-menu-crud/context-menu-crud';

type DeleteSectionItemParams = {
    id: number;
    sectionId: number;
};

export type DeleteSectionItemFunction = (event: Event, params: DeleteSectionItemParams, accept?: () => void, reject?: () => void) => void;
@Component({
    selector: 'sections-list',
    imports: [
        SectionItem,
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
        SectionItemForm,
        ErrorBoundary,
        PanelModule,
        CarouselModule,
        DragDropModule,
        FilterSectionsByPagePipe,
        MessageModule,
        DataViewSkeleton,
        FieldsetModule,
        TagModule,
        ButtonModule,
        ContextMenuCrud,
        BadgeModule
    ],
    templateUrl: './sections-list.html'
})
export class SectionsList {
    private readonly pagesService = inject(PageService);
    private readonly sectionService = inject(SectionService);
    private readonly sectionItemService = inject(SectionItemService);
    private readonly sectionFormService = inject(SectionFormService);
    private readonly sectionItemFormService = inject(SectionItemFormService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);

    type = input<'layouts' | 'personalized'>('personalized');
    selectedPage = model<Page | null>(null);
    onDisplay = output<boolean>();
    onSelectedSection = output<Section | null>();

     @ViewChild(ContextMenuCrud) contextMenu!: ContextMenuCrud;

    sectionStatusOptions = sectionStatusOptions;

    sectionTypesOptions = sectionTypesOptions;

    SectionType = SectionType;

    sectionList = this.sectionService.sectionListResource;

    displayItemDialog = signal<boolean>(false);
    currentSection = signal<any | null>(null);
    selectedSectionItem = signal<ISectionItem | null>(null);
    

    orginalSectionList = linkedSignal<Section[]>(() => {
        const sectionList = this.sectionList.hasValue() ? this.sectionList.value() : [];
        const pageId = this.selectedPage()?.id;
        if (!pageId) return sectionList;
        return new FilterSectionsByPagePipe().transform(sectionList, pageId);
    });

    targetList = signal<Section[]>([]);

    hasPositionChanged = signal<boolean>(false);

    openDialogAndEdit(section: Section) {
        this.onDisplay.emit(true);
        this.onSelectedSection.emit(section);

        this.sectionFormService.populateForm(section);
    }

    openDialogItem(section: Section, item?: ISectionItem) {
        this.displayItemDialog.set(true);
        this.currentSection.set(section);
        this.selectedSectionItem.set(item || null);
        this.sectionItemFormService.setSectionType(section.type);
        if (item) {
            this.sectionItemFormService.populateForm(item);
        }
    }

    edit = () => {
        const section = this.currentSection();
        this.onDisplay.emit(true);
        this.onSelectedSection.emit(section);

        this.sectionFormService.populateForm(section!);
    }


    delete = ($event: MenuItemCommandEvent) => {
        const section = this.currentSection();
        if (!section) return;
        const message = section.items && section.items.length > 0 ? 'Esta sección tiene ítems asociados. ¿Seguro que deseas eliminarla?' : '¿Seguro que deseas eliminar esta sección?';
        this.confirmationDialog(
            $event.originalEvent!,
            message,
            'Eliminar sección',
            () => {
                this.sectionService.deleteSection(section.id).subscribe();
            },
            () => {}
        );
    }



    drop(event: CdkDragDrop<Section[]>, targetList: Section[]) {
        // Si se reordenó dentro del mismo contenedor
        if (event.previousContainer === event.container) {
            moveItemInArray(targetList, event.previousIndex, event.currentIndex);
        } else {
            // Si se movió entre contenedores (por ejemplo, de children a principal)
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }

        if (this.hasOrderChanged(targetList)) {
            this.targetList.set(structuredClone(targetList));
            this.hasPositionChanged.set(true);
        }
    }

    savePositionChanges() {
        const newOrder = this.targetList().map((section, index) => ({ id: section.id, order: index + 1 }));
        this.sectionService.updateSectionsOrder({ orderArray: newOrder }).subscribe({
            next: () => {
                this.sectionList.update((sections) => {
                    if (!sections) return [];
                    return structuredClone(this.targetList());
                });
                this.orginalSectionList.set(structuredClone(this.targetList()));
                this.hasPositionChanged.set(false);
            }
        });
    }

    cancelChanges() {
        this.sectionList.update((sections) => {
            if (!sections) return [];
            const original = this.orginalSectionList();
            return structuredClone(original);
        });
        this.hasPositionChanged.set(false);

        this.messageService.setSuccess('Los cambios han sido descartados correctamente.');
    }

    hasOrderChanged(currentList: Section[]): boolean {
        const current = currentList;
        const original = this.orginalSectionList();

        if (current.length !== original.length) return true;

        for (let i = 0; i < current.length; i++) {
            if (current[i].id !== original[i].id) {
                return true;
            }
        }

        return false;
    }

    deleteSection($event: Event, section: Section) {
        const message = section.items && section.items.length > 0 ? 'Esta sección tiene ítems asociados. ¿Seguro que deseas eliminarla?' : '¿Seguro que deseas eliminar esta sección?';
        this.confirmationDialog(
            $event,
            message,
            'Eliminar sección',
            () => {
                this.sectionService.deleteSection(section.id).subscribe();
            },
            () => {}
        );
    }

    deleteSectionItemConfirmation(event: Event, { id, sectionId }: DeleteSectionItemParams, accept?: () => void, reject?: () => void) {
        this.confirmationDialog(
            event,
            '¿Estás seguro de que deseas eliminar este ítem de sección? Esta acción no se puede deshacer.',
            'Eliminar ítem de sección',
            () => {
                this.sectionItemService.delete(id, sectionId).subscribe();
                if (accept) accept();
            },
            () => {
                if (reject) reject();
            }
        );
    }

    private confirmationDialog = (event: Event, message: string, header: string, accept: () => void, reject: () => void) => {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: message,
            header: header,
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Eliminar'
            },
            accept,
            reject
        });
    };

    

    
}
