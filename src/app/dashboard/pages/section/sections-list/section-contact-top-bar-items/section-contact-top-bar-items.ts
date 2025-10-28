import type { Section } from '@/shared/interfaces/section';
import { SectionItem } from '@/shared/interfaces/section-item';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import type { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import { IconImage } from '../../components/icon-image/icon-image';

@Component({
    selector: 'section-contact-top-bar-items',
    imports: [EmptyFieldMessage, IconImage, MenuModule, ButtonModule],
    templateUrl: './section-contact-top-bar-items.html'
})
export class SectionContactTopBarItems {
    section = input.required<Section>();
    contextMenu = input.required<ContextMenuCrud<SectionItem>>();
}
