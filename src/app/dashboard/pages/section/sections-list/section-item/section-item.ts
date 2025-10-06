import { Component, input } from '@angular/core';
import type { SectionItem as ISectionItem } from '@/shared/interfaces/section-item';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'section-item',
    imports: [CardModule, ButtonModule],
    templateUrl: './section-item.html'
})
export class SectionItem {
    sectionItem = input.required<ISectionItem>();
}
