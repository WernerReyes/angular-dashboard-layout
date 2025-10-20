import type { Section } from '@/shared/interfaces/section';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import type { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';

@Component({
    selector: 'section-our-company-items',
    imports: [EmptyFieldMessage, MenuModule, ButtonModule],
    templateUrl: './section-our-company-items.html'
})
export class SectionOurCompanyItems {
    section = input.required<Section>();
    contextMenu = input.required<ContextMenuCrud<SectionItem>>();
}
