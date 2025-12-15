import { PageService } from '@/dashboard/services/page.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import type { Page } from '@/shared/interfaces/page';
import { sectionStatusOptions, sectionTypesOptions, type Section } from '@/shared/interfaces/section';
import { Component, computed, effect, inject, linkedSignal, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectChangeEvent, SelectModule } from 'primeng/select';

import { SectionService } from '@/dashboard/services/section.service';
import { SectionMode, SectionType } from '@/shared/mappers/section.mapper';
import { ConfirmationService, MenuItemCommandEvent } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PopoverModule } from 'primeng/popover';
import { SectionForm } from '../../section-form/section-form';
// import { SectionsList } from '../../sections-list/sections-list';
import { SectionItemService } from '@/dashboard/services/section-item.service';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import { SectionItem } from '@/shared/interfaces/section-item';
import { MessageService } from '@/shared/services/message.service';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Badge } from 'primeng/badge';
import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';
import { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { SectionItemForm } from '../../sections-list/section-item-form/section-item-form';
import { SectionItems } from '../../sections-list/section-items/section-items';
import { SectionFormService } from '../../services/section-form.service';
import { SectionItemFormService } from '../../services/section-item-form.service';

type DeleteSectionItemParams = {
    id: number;
    sectionId: number;
};

@Component({
    selector: 'app-custom-page',
    imports: [ErrorBoundary, SectionForm, PopoverModule, FormsModule, SelectModule, ButtonModule, ConfirmDialogModule, DataViewSkeleton, SectionItems, DragDropModule, Message, Badge, Tag, ContextMenuCrud, SectionItemForm],
    templateUrl: './custom.page.html',
    providers: [ConfirmationService]
})
export default class CustomPage {
    private readonly confirmationService = inject(ConfirmationService);
    readonly sectionService = inject(SectionService);
    readonly pageService = inject(PageService);
    private readonly messageService = inject(MessageService);
    private readonly sectionFormService = inject(SectionFormService);
    private readonly sectionItemService = inject(SectionItemService);
    private readonly sectionItemFormService = inject(SectionItemFormService);

    @ViewChild(ContextMenuCrud) contextMenu!: ContextMenuCrud<Section>;

    pagesListRs = this.pageService.pagesListResource;

    SectionMode = SectionMode;
    SectionType = SectionType;

    //   selectedSection = signal<Section | null>(null);
    selectedSectionItem = signal<SectionItem | null>(null);

    currentSection = signal<Section | null>(null);
    displayItemDialog = signal<boolean>(false);

    selectedSection = signal<Section | null>(null);
    display = signal<boolean>(false);
    targetList = signal<Section[]>([]);
    hasPositionChanged = signal<boolean>(false);

    savePosition = signal<boolean>(false);

    private readonly pageId = computed<number>(() => {
        const page = this.selectedPage();
        return page ? page.id : 0;
    });

    sections = linkedSignal<Section[]>(() => {
        const page = this.pageService.pageByIdRs.value();
        if (!page) return [];
        return (page.sections || []).sort((a, b) => {
            const pageId = this.pageId();
            const pivotA = a.pivotPages?.find((pivot) => pivot.idPage === pageId);
            const pivotB = b.pivotPages?.find((pivot) => pivot.idPage === pageId);
            if (pivotA && pivotB) {
                return pivotA.orderNum - pivotB.orderNum;
            }
            return 0;
        });
    });

    originalSectionList = signal<Section[]>([]);

    pages = computed<Page[]>(() => {
        const pages = this.pagesListRs.hasValue() ? this.pagesListRs.value() : [];
        return pages.filter((page) => page.id !== this.selectedPage()?.id);
    });

    selectedPage = linkedSignal<Page | null>(() => {
        const storedPageId = localStorage.getItem('selectedPage');
        const pageList = this.pagesListRs.hasValue() ? this.pagesListRs.value() : [];
        if (storedPageId) {
            const pageId = parseInt(storedPageId, 10);
            const page = pageList.find((p) => p.id === pageId) || null;
            return page;
        }
        return pageList[0] || null;
    });

    private setOriginalSectionList = effect(() => {
        const sections = this.sections();

        if ((sections.length && this.originalSectionList().length === 0) || this.savePosition()) {
            this.originalSectionList.set(structuredClone(sections));
            this.savePosition.set(false);
        }
    });

    private setPageIdToService = effect(() => {
        const page = this.selectedPage();
        if (page) {
            this.pageService.pageId.set(page.id);
        }
    });

    private setSelectedPageToLocalStorage = effect(() => {
        const page = this.selectedPage();
        if (page) {
            localStorage.setItem('selectedPage', page.id.toString());
        }
    });

    isSectionLayout(section: Section): boolean {
        return section.pivotPages?.some((pivot) => pivot.type === SectionMode.LAYOUT) ?? false;
    }

    getSectionStatus(section: Section) {
        const active = section.pivotPages?.some((pivot) => pivot.idPage === this.pageId() && pivot.active);
        return sectionStatusOptions[`${active}`];
    }

    getSectionType(section: Section) {
        return sectionTypesOptions[`${section.type}`];
    }

    openDialogItem(section: Section, item?: SectionItem) {
        this.displayItemDialog.set(true);
        this.currentSection.set(section);
        this.selectedSectionItem.set(item || null);
        this.sectionItemFormService.setSectionType(section.type);
        if (item) {
            this.sectionItemFormService.populateForm(item);
        }
    }

    moveToPage(e: SelectChangeEvent, section: Section, newPageId: number) {
        const page = this.selectedPage();
        if (page && section) {
            this.confirmationService.confirm({
                target: e.originalEvent?.target as EventTarget,
                message: "¿Estás seguro de que deseas mover la sección '" + section.title + "' a la página '" + this.pages().find((p) => p.id === newPageId)?.title + "'?",
                header: 'Confirmar movimiento',
                closable: true,
                closeOnEscape: true,
                icon: 'pi pi-exclamation-triangle',
                rejectButtonProps: {
                    label: 'Cancelar',
                    severity: 'secondary',
                    outlined: true
                },
                acceptButtonProps: {
                    label: 'Confirmar'
                },
                accept: () => {
                    this.sectionService.moveSectionToPage(section.id, page.id, newPageId).subscribe({
                        next: () => {
                            this.selectedSection.set(null);
                        }
                    });
                }
                // accept,
                // reject
            });
        }
    }

    edit = () => {
        const section = this.currentSection();
        // this.onDisplay.emit(true);
        this.display.set(true);
        this.selectedSection.set(section);
        // this.onSelectedSection.emit(section);

        this.sectionFormService.populateForm(section!, 0);
    };

    duplicate = () => {
        // let id: number | null = this.pageId();
        // if (this.type() === SectionMode.LAYOUT) {
        //     id = null;
        // }
        const section = this.currentSection();
        if (!section) return;

        this.sectionService.duplicateSection(section.id, this.pageId()).subscribe();
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
                // const isSectionLayout = this.isSectionLayout(section);
                // if (isSectionLayout && this.type() === SectionMode.CUSTOM) {
                //     this.sectionService.deleteSection(section.id, this.pageId()).subscribe();
                //     return;
                // }
                this.sectionService.deleteSection(section.id, this.pageId()).subscribe();
            },
            () => {}
        );
    };

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

    duplicateSectionItem = (sectionItem: SectionItem) => {
        this.sectionItemService.duplicate(sectionItem.id).subscribe();
    };

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
                this.sections.update((sections) => {
                    if (!sections) return [];
                    return this.localOrder(sections, newOrder);
                });

                this.hasPositionChanged.set(false);
                this.savePosition.set(true);
            }
        });
    }

    cancelChanges() {
        const original = this.originalSectionList().map((section, index) => ({ id: section.id, pageId: this.pageId(), order: index + 1 }));
        this.sections.update((sections) => {
            if (!sections) return [];
            return this.localOrder(sections, original);
        });
        this.hasPositionChanged.set(false);

        this.messageService.setSuccess('Los cambios han sido descartados correctamente.');
    }

    hasOrderChanged(currentList: Section[]): boolean {
        const current = currentList;
        const original = this.originalSectionList();

        if (current.length !== original.length) return true;

        for (let i = 0; i < current.length; i++) {
            if (current[i].id !== original[i].id) {
                return true;
            }
        }

        return false;
    }

    private localOrder(
        sections: Section[],
        orderList: {
            id: number;
            pageId: number;
            order: number;
        }[]
    ) {
        const orderMap = new Map(orderList.map((item) => [item.id, item.order]));

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
    }
}
