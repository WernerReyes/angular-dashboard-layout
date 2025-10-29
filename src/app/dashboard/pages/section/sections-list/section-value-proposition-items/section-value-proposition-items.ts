import { Section } from '@/shared/interfaces/section';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import type { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import { NgClass } from '@angular/common';

@Component({
    selector: 'section-value-proposition-items',
    imports: [NgClass, CardModule, EmptyFieldMessage, ButtonModule],
    templateUrl: './section-value-proposition-items.html'
})
export class SectionValuePropositionItems {
    section = input.required<Section>();
    contextMenu = input<ContextMenuCrud<SectionItem>>();
    currentSectionItem = input<SectionItem | null>(null);
}
