import { Section } from '@/shared/interfaces/section';
import { Component, computed, input } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';

@Component({
    selector: 'section-machine-details-items',
    imports: [CardModule, GalleriaModule, EmptyFieldMessage, AccordionModule, ButtonModule],
    templateUrl: './section-machine-details-items.html'
})
export class SectionMachineDetailsItems {
    section = input.required<Section>();

    machine = computed(() => {
        return this.section().machines?.length ? this.section()?.machines?.[0] : null;
    });

    imagesGallery = computed(() => {
        const orderByMainImage = this.machine()
            ?.images?.slice()
            .sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0));
        return orderByMainImage ?? [];
    });
}
