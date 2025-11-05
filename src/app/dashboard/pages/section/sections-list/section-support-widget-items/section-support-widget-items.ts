import type { Section } from '@/shared/interfaces/section';
import { Component, ElementRef, input, signal, ViewChild } from '@angular/core';
import { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { NgClass } from '@angular/common';

@Component({
    selector: 'section-support-widget-items',
    imports: [NgClass, CardModule, TextareaModule, ButtonModule],
    templateUrl: './section-support-widget-items.html'
})
export class SectionSupportWidgetItems {
    section = input.required<Section>();
    contextMenu = input<ContextMenuCrud<SectionItem>>();
    currentSectionItem = input<SectionItem | null>();

    isChatOpen = signal(false);
}
