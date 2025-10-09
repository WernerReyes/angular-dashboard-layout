import type { SectionItem } from '@/shared/interfaces/section-item';
import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { EmptyFieldMessage } from '../../empty-field-message/empty-field-message';

@Component({
  selector: 'hero-item',
  imports: [ButtonModule, EmptyFieldMessage, NgClass],
  templateUrl: './hero-item.html',
})
export class HeroItem {
 item = input.required<SectionItem>();
}
