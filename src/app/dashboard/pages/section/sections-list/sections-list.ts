import { SectionService } from '@/dashboard/services/section.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { DataViewSkeleton } from '@/shared/components/skeleton/data-view-skeleton/data-view-skeleton';
import { Page } from '@/shared/interfaces/page';
import { Component, inject, input, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FilterSectionsByPagePipe } from '../pipes/filter-sections-by-page-pipe';
import { Section, sectionStatusOptions } from '@/shared/interfaces/section';
import { TagModule } from 'primeng/tag';
import { SectionFormService } from '../services/section-form.service';
import { SectionItemForm } from './section-item-form/section-item-form';
import { SectionItem } from './section-item/section-item';

@Component({
    selector: 'sections-list',
    imports: [SectionItem, SectionItemForm, ErrorBoundary, FilterSectionsByPagePipe, DataViewSkeleton, TagModule, ButtonModule],
    templateUrl: './sections-list.html'
})
export class SectionsList {
    private readonly sectionService = inject(SectionService);
    private readonly sectionFormService = inject(SectionFormService);

    selectedPage = input<Page | null>(null);
    onDisplay = output<boolean>();
    onSelectedSection = output<Section>();

    sectionStatusOptions = sectionStatusOptions;

    sectionList = this.sectionService.sectionListResource;

    displayItemDialog = signal<boolean>(false);
    currentSection = signal<Section | null>(null);

    openDialogAndEdit(section: Section) {
        this.onDisplay.emit(true);
        this.onSelectedSection.emit(section);

        this.sectionFormService.populateForm(section);
    }

    openDialogItem(section: Section) {
        console.log('Section ID:', section.id);
        this.displayItemDialog.set(true);
        this.currentSection.set(section);
    }


}
