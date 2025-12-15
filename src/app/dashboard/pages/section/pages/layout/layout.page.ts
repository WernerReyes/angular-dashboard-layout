import { PageService } from '@/dashboard/services/page.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import type { Page } from '@/shared/interfaces/page';
import type { Section } from '@/shared/interfaces/section';
import { Component, inject, linkedSignal, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import type { AssocieteSectionToPages } from '@/dashboard/interfaces/section';
import { SectionService } from '@/dashboard/services/section.service';
import { SectionMode, SectionType } from '@/shared/mappers/section.mapper';
import { FormUtils } from '@/utils/form-utils';
import { JsonPipe, KeyValuePipe } from '@angular/common';
import { ConfirmationService, MenuItemCommandEvent } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { PopoverModule } from 'primeng/popover';
import { SectionForm } from '../../section-form/section-form';
// import { SectionsList } from '../../sections-list/sections-list';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { sectionTypesOptions } from '@/shared/interfaces/section';
import { TagModule } from 'primeng/tag';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import { Badge } from 'primeng/badge';
import { SectionItems } from '../../sections-list/section-items/section-items';
import { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { SectionItemForm } from '../../sections-list/section-item-form/section-item-form';
import { SectionItem } from '@/shared/interfaces/section-item';
import { SectionItemFormService } from '../../services/section-item-form.service';
import { SectionItemService } from '@/dashboard/services/section-item.service';
import { SectionFormService } from '../../services/section-form.service';
import { FilterByTermPipe } from '@/dashboard/pipes/filter-by-term-pipe';
import { FilterArrayByPipe } from '@/shared/pipes/filter-array-by-pipe';

type DeleteSectionItemParams = {
    id: number;
    sectionId: number;
};
@Component({
    selector: 'app-layout-page',
    imports: [
        KeyValuePipe,
        
        FilterByTermPipe,
        FilterArrayByPipe,
        MessageModule,
        ErrorBoundary,
        ReactiveFormsModule,
        MultiSelectModule,
        TagModule,
        SectionForm,
        SelectModule,
        ButtonModule,
        ConfirmDialogModule,
        PopoverModule,
        ButtonModule,
        InputGroupModule,
        InputGroupAddonModule,
        InputTextModule,
        DividerModule,
        MultiSelectModule,
        DataViewSkeleton,
        Badge,
        SectionItems,
        ContextMenuCrud,
        SectionItemForm
    ],
    templateUrl: './layout.page.html',
    providers: [ConfirmationService]
})
export default class LayoutPage {
    private readonly fb = inject(FormBuilder);
    private readonly pageService = inject(PageService);
    readonly sectionService = inject(SectionService);
    private readonly sectionItemService = inject(SectionItemService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly sectionFormService = inject(SectionFormService);
    private readonly sectionItemFormService = inject(SectionItemFormService);

    @ViewChild(ContextMenuCrud) contextMenu!: ContextMenuCrud<Section>;

    selectedSection = signal<Section | null>(null);
    selectedSectionItem = signal<SectionItem | null>(null);

    currentSection = signal<Section | null>(null);
    displayItemDialog = signal<boolean>(false);
    display = signal<boolean>(false);

    pageList = this.pageService.pagesListResource;

    

    sectionsLayoutsListRs = this.sectionService.sectionLayoutsListRs;

    SectionMode = SectionMode;
    sectionTypesOptions = sectionTypesOptions;
    SectionType = SectionType;

    // selectedPage = linkedSignal<Page | null>(() => {
    //     return this.pageList.hasValue() ? this.pageList.value()![0] : null;
    // });

    form = this.fb.group({
        pagesIds: [[] as number[]]
    });

    FormUtils = FormUtils;

    setPages(section: Section) {
        const pagesIds = section.pages?.map((page) => page.id) || [];
        this.form.patchValue({ pagesIds });
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

    associateToPages(section: Section) {
        if (this.form.invalid) return;

        const payload: AssocieteSectionToPages = {
            sectionId: section.id,
            pagesIds: this.form.value.pagesIds || []
        };

        this.sectionService.associateToPages(payload).subscribe();
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

        this.sectionService.duplicateSection(section.id, null, this.SectionMode.LAYOUT).subscribe();
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
                // const isSectionLayout = this.isSectionLayout(section);
                // if (isSectionLayout && this.type() === SectionMode.CUSTOM) {
                //     this.sectionService.deleteSection(section.id, this.pageId()).subscribe();
                //     return;
                // }
                this.sectionService.deleteSection(section.id, undefined, this.SectionMode.LAYOUT).subscribe();
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
                this.sectionItemService.delete(id, sectionId, this.SectionMode.LAYOUT).subscribe();
                if (accept) accept();
            },
            () => {
                if (reject) reject();
            }
        );
    }

     duplicateSectionItem = (sectionItem: SectionItem) => {
        this.sectionItemService.duplicate(sectionItem.id, this.SectionMode.LAYOUT).subscribe();
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
