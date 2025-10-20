import type { Section } from '@/shared/interfaces/section';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import type { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';

@Component({
    selector: 'section-advantages-items',
    imports: [EmptyFieldMessage, CardModule],
    templateUrl: './section-advantages-items.html'
})
export class SectionAdvantagesItems {
    section = input.required<Section>();
    contextMenu = input.required<ContextMenuCrud<SectionItem>>();
}
