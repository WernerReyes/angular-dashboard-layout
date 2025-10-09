import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import type { Section } from '@/shared/interfaces/section';
import { EmptyFieldMessage } from '../empty-field-message/empty-field-message';

@Component({
  selector: 'section-why-us-items',
  imports: [EmptyFieldMessage, CardModule],
  templateUrl: './section-why-us-items.html',
})
export class SectionWhyUsItems {
    section = input.required<Section>();
}
