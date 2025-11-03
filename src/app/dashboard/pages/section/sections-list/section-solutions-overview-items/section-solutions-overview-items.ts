import type { Section } from '@/shared/interfaces/section';
import { SectionItem } from '@/shared/interfaces/section-item';
import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import type { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import { IconImage } from '../../components/icon-image/icon-image';

@Component({
    selector: 'section-solutions-overview-items',
    imports: [NgClass, IconImage, CardModule, EmptyFieldMessage, MenuModule],
    templateUrl: './section-solutions-overview-items.html'
})
export class SectionSolutionsOverviewItems {
    section = input.required<Section>();
    contextMenu = input<ContextMenuCrud<SectionItem>>();
    currentSectionItem = input<SectionItem | null>();
    isPreview = input<boolean>(false);
}
