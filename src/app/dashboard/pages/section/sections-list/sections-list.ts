import { FilterByPagePipe } from '@/dashboard/pipes/filter-by-page-pipe';
import { FilterByTermPipe } from '@/dashboard/pipes/filter-by-term-pipe';
import { SectionItemService } from '@/dashboard/services/section-item.service';
import { SectionService } from '@/dashboard/services/section.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import { Page } from '@/shared/interfaces/page';
import { Section, sectionStatusOptions, sectionTypesOptions } from '@/shared/interfaces/section';
import type { SectionItem as ISectionItem } from '@/shared/interfaces/section-item';
import { SectionMode, SectionType } from '@/shared/mappers/section.mapper';
import { MessageService } from '@/shared/services/message.service';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, ContentChild, inject, input, linkedSignal, output, signal, TemplateRef, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItemCommandEvent } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { FieldsetModule } from 'primeng/fieldset';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { ContextMenuCrud } from '../components/context-menu-crud/context-menu-crud';
import { SectionFormService } from '../services/section-form.service';
import { SectionItemFormService } from '../services/section-item-form.service';
import { SectionItemForm } from './section-item-form/section-item-form';
import { SectionItems } from './section-items/section-items';

import { FilterArrayByPipe } from '@/shared/pipes/filter-array-by-pipe';
import { SelectModule } from 'primeng/select';
import { PopoverModule } from 'primeng/popover';
import { PageService } from '@/dashboard/services/page.service';

type DeleteSectionItemParams = {
    id: number;
    sectionId: number;
};

export type DeleteSectionItemFunction = (event: Event, params: DeleteSectionItemParams, accept?: () => void, reject?: () => void) => void;
@Component({
    selector: 'sections-list',
    imports: [
        SectionItemForm,
        FilterArrayByPipe,
        ErrorBoundary,
        PanelModule,
        CarouselModule,
        FilterByTermPipe,
        DragDropModule,
        NgTemplateOutlet,

        SelectModule,
        MessageModule,
        DataViewSkeleton,
        FieldsetModule,
        TagModule,
        PopoverModule,
        ButtonModule,
        ContextMenuCrud,
        SectionItems,
        BadgeModule,
        FilterByPagePipe
    ],
    templateUrl: './sections-list.html'
})
export class SectionsList {
    private readonly sectionService = inject(SectionService);
    private readonly sectionItemService = inject(SectionItemService);
    private readonly sectionFormService = inject(SectionFormService);
    private readonly sectionItemFormService = inject(SectionItemFormService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);
    private readonly filterByPagePipe = new FilterByPagePipe();

    @ContentChild('associatedPage') associatedPageTemplate?: TemplateRef<any>;

    type = input.required<SectionMode>();
    selectedPage = input<Page | null>(null);
    onDisplay = output<boolean>();
    onSelectedSection = output<Section | null>();
    searchTerm = input<string>('');
    filterByType = input<Array<string>>([]);

    @ViewChild(ContextMenuCrud) contextMenu!: ContextMenuCrud<Section>;

    getSectionStatus(section: Section) {
        const active = section.pivotPages?.some((pivot) => pivot.idPage === this.pageId() && pivot.active);
        return sectionStatusOptions[`${active}`];
    }

    getSectionType(section: Section) {
        return sectionTypesOptions[`${section.type}`];
    }

    pageId = computed(() => this.selectedPage()?.id ?? 3);

    SectionType = SectionType;
    SectionMode = SectionMode;



    sectionsListRs = this.sectionService.sectionListResource;
   

    displayItemDialog = signal<boolean>(false);
    currentSection = signal<Section | null>(null);
    selectedSectionItem = signal<ISectionItem | null>(null);

    orginalSectionList = linkedSignal<Section[]>(() => {
        const sectionList = this.sectionsListRs.hasValue() ? this.sectionsListRs.value() : [];
        const pageId = this.selectedPage()?.id;
        if (!pageId) return sectionList;
        return this.filterByPagePipe.transform(sectionList, { idPage: pageId, type: this.type() }, ['idPage', 'type']);
    });

    targetList = signal<Section[]>([]);

    hasPositionChanged = signal<boolean>(false);

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

        this.sectionFormService.populateForm(section!, this.pageId());
    };

    delete = ($event: MenuItemCommandEvent) => {
        const section = this.currentSection();
        if (!section) return;
        const message = section.items && section.items.length > 0 ? 'Esta sección tiene ítems asociados. ¿Seguro que deseas eliminarla?' : '¿Seguro que deseas eliminar esta sección?';
        this.confirmationDialog(
            $event.originalEvent!,
            message,
            'Eliminar sección',
            () => {
                const isSectionLayout = this.isSectionLayout(section);
                if (isSectionLayout && this.type() === SectionMode.CUSTOM) {
                    this.sectionService.deleteSection(section.id, this.pageId()).subscribe();
                    return;
                }
                this.sectionService.deleteSection(section.id).subscribe();
            },
            () => {}
        );
    };

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
        const newOrder = this.targetList().map((section, index) => ({ id: section.id, pageId: this.pageId(), order: index + 1 }));
        this.sectionService.updateSectionsOrder({ orderArray: newOrder }).subscribe({
            next: () => {
                this.sectionsListRs.update((sections) => {
                    if (!sections) return [];

                    const orderMap = new Map(newOrder.map((item) => [item.id, item.order]));

                    // Solo modificamos el order_num dentro de pivot_pages
                    const updatedSections = sections.map((section) => {
                        const pivot = section.pivotPages?.find((p) => p.idPage === this.pageId());
                        if (pivot && orderMap.has(section.id)) {
                            pivot.orderNum = orderMap.get(section.id)!;
                        }
                        return section;
                    });

                    // Reordenar secciones por su nuevo order_num
                    return [...updatedSections].sort((a, b) => {
                        const orderA = a.pivotPages?.find((p) => p.idPage === this.pageId())?.orderNum ?? 9999;
                        const orderB = b.pivotPages?.find((p) => p.idPage === this.pageId())?.orderNum ?? 9999;
                        return orderA - orderB;
                    });
                });

                this.hasPositionChanged.set(false);
            }
        });
    }

    cancelChanges() {
        const original = this.orginalSectionList().map((section, index) => ({ id: section.id, pageId: this.pageId(), order: index + 1 }));
        this.sectionsListRs.update((sections) => {
            if (!sections) return [];
            const orderMap = new Map(original.map((item) => [item.id, item.order]));

            // Solo modificamos el order_num dentro de pivot_pages
            const updatedSections = sections.map((section) => {
                const pivot = section.pivotPages?.find((p) => p.idPage === this.pageId());
                if (pivot && orderMap.has(section.id)) {
                    pivot.orderNum = orderMap.get(section.id)!;
                }
                return section;
            });

            // Reordenar secciones por su nuevo order_num
            return [...updatedSections].sort((a, b) => {
                const orderA = a.pivotPages?.find((p) => p.idPage === this.pageId())?.orderNum ?? 9999;
                const orderB = b.pivotPages?.find((p) => p.idPage === this.pageId())?.orderNum ?? 9999;
                return orderA - orderB;
            });
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

    isSectionLayout(section: Section): boolean {
        return section.pivotPages?.some((pivot) => pivot.type === SectionMode.LAYOUT) ?? false;
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
