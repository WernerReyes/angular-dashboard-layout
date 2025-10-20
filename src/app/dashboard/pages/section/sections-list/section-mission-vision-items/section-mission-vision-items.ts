import type { Section } from '@/shared/interfaces/section';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import type { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';

@Component({
  selector: 'section-mission-vision-items',
  imports: [EmptyFieldMessage, CardModule, ButtonModule],
  templateUrl: './section-mission-vision-items.html',
})
export class SectionMissionVisionItems {
  section = input.required<Section>();
   contextMenu = input.required<ContextMenuCrud<SectionItem>>();
    
}
