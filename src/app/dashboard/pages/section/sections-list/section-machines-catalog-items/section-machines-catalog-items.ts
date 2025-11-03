import type { Section } from '@/shared/interfaces/section';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { NgClass } from '@angular/common';
import { Machine } from '@/shared/interfaces/machine';

@Component({
  selector: 'section-machines-catalog-items',
  imports: [NgClass, CardModule, ButtonModule],
  templateUrl: './section-machines-catalog-items.html',
})
export class SectionMachinesCatalogItems {
  section = input.required<Section>();
  isPreview = input<boolean>(false);


  getMainImageUrl(
    machine: Machine
  ) {
    const mainImage = machine.images?.find((img) => img.isMain) || machine.images?.[0];
    return mainImage ? mainImage.url : '';
  }

}
