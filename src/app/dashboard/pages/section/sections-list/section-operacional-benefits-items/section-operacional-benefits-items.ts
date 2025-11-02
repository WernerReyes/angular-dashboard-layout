import type { Section } from '@/shared/interfaces/section';
import { Component, input } from '@angular/core';
import type { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { NgClass } from '@angular/common';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { IconImage } from '../../components/icon-image/icon-image';

@Component({
    selector: 'section-operacional-benefits-items',
    imports: [NgClass, IconImage, EmptyFieldMessage, CardModule, ButtonModule],
    templateUrl: './section-operacional-benefits-items.html'
})
export class SectionOperacionalBenefitsItems {
    section = input.required<Section>();
    contextMenu = input<ContextMenuCrud<SectionItem>>();
    currentSectionItem = input<SectionItem | null>();
    isPreview = input<boolean>(false);
}
