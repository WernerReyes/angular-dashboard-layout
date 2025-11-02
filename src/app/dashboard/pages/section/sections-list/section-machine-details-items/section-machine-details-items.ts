import { Section } from '@/shared/interfaces/section';
import { JsonPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'section-machine-details-items',
  imports: [CardModule, JsonPipe, GalleriaModule, AccordionModule, ButtonModule],
  templateUrl: './section-machine-details-items.html',
})
export class SectionMachineDetailsItems {

   section = input.required<Section>();

   machine = computed(() => {

     return this.section().machines?.length ? this.section()?.machines?.[0] : null;
   });
}
   
