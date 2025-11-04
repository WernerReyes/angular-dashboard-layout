import type { Section } from '@/shared/interfaces/section';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import { IconImage } from '../../components/icon-image/icon-image';
import { JsonPipe, NgClass } from '@angular/common';
import { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import type { SectionItem } from '@/shared/interfaces/section-item';

@Component({
  selector: 'section-full-maintenance-plan-items',
  imports: [JsonPipe, NgClass, EmptyFieldMessage, ButtonModule, IconImage],
  templateUrl: './section-full-maintenance-plan-items.html',
})
export class SectionFullMaintenancePlanItems {
  section = input.required<Section>();
  contextMenu = input<ContextMenuCrud<SectionItem>>();
  currentSectionItem = input<SectionItem | null>();
  isPreview = input<boolean>(false);


}
