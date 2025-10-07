import { SectionService } from '@/dashboard/services/section.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import { Page } from '@/shared/interfaces/page';
import { Section, sectionStatusOptions, sectionTypesOptions } from '@/shared/interfaces/section';
import type { SectionItem as ISectionItem } from '@/shared/interfaces/section-item';
import { MessageService } from '@/shared/services/message.service';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, inject, linkedSignal, model, output, signal } from '@angular/core';
import { Badge } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { FilterSectionsByPagePipe } from '../pipes/filter-sections-by-page-pipe';
import { SectionFormService } from '../services/section-form.service';
import { SectionItemFormService } from '../services/section-item-form.service';
import { SectionItemForm } from './section-item-form/section-item-form';
import { SectionItem } from './section-item/section-item';
import { SectionHeroItem } from './section-hero-item/section-hero-item';
import { SectionType } from '@/shared/mappers/section.mapper';

@Component({
    selector: 'sections-list',
    imports: [SectionItem, SectionHeroItem, SectionItemForm, ErrorBoundary, DragDropModule, FilterSectionsByPagePipe, MessageModule, DataViewSkeleton, FieldsetModule, TagModule, ButtonModule, Badge],
    templateUrl: './sections-list.html'
})
export class SectionsList {
    private readonly sectionService = inject(SectionService);
    private readonly sectionFormService = inject(SectionFormService);
    private readonly sectionItemFormService = inject(SectionItemFormService);
    private readonly messageService = inject(MessageService);

    selectedPage = model<Page | null>(null);
    onDisplay = output<boolean>();
    onSelectedSection = output<Section>();

    sectionStatusOptions = sectionStatusOptions;

    sectionTypesOptions = sectionTypesOptions;

    SectionType = SectionType;

    sectionList = this.sectionService.sectionListResource;

    displayItemDialog = signal<boolean>(false);
    currentSection = signal<Section | null>(null);
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
        if (item) {
            this.sectionItemFormService.populateForm(item);
        }
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
}
