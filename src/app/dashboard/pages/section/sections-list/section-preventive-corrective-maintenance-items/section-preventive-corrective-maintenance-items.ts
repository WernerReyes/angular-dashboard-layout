import type { Section } from '@/shared/interfaces/section';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import { NgClass } from '@angular/common';

@Component({
  selector: 'section-preventive-corrective-maintenance-items',
  imports: [NgClass, EmptyFieldMessage, ButtonModule],
  templateUrl: './section-preventive-corrective-maintenance-items.html',
})
export class SectionPreventiveCorrectiveMaintenanceItems {
  section = input.required<Section>();
  isPreview = input<boolean>(false);
}
