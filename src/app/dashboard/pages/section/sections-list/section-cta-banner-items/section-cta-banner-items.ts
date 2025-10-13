import { Component, input } from '@angular/core';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import { NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import type { Section } from '@/shared/interfaces/section';

@Component({
  selector: 'section-cta-banner-items',
  imports: [EmptyFieldMessage, NgClass, ButtonModule],
  templateUrl: './section-cta-banner-items.html',
  styleUrl: './section-cta-banner-items.scss'
})
export class SectionCtaBannerItems {
  section = input.required<Section>();
}
