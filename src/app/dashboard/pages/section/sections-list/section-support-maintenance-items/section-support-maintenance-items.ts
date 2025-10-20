import { Section } from '@/shared/interfaces/section';
import { Component, input } from '@angular/core';

import { SectionItem } from '@/shared/interfaces/section-item';
import { CardModule } from 'primeng/card';
import { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';

@Component({
    selector: 'section-support-maintenance-items',
    imports: [CardModule, EmptyFieldMessage],
    templateUrl: './section-support-maintenance-items.html'
})
export class SectionSupportMaintenanceItems {
    section = input.required<Section>();
    contextMenu = input.required<ContextMenuCrud<SectionItem>>();

    
}
