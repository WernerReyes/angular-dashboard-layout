import type { Section } from '@/shared/interfaces/section';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { NgClass } from '@angular/common';

@Component({
  selector: 'section-machines-catalog-items',
  imports: [NgClass, CardModule, ButtonModule],
  templateUrl: './section-machines-catalog-items.html',
})
export class SectionMachinesCatalogItems {
  section = input.required<Section>();
  isPreview = input<boolean>(false);

}
