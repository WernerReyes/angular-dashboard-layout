import type { Section } from '@/shared/interfaces/section';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import type { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import { InputType } from '@/shared/mappers/section-item.mapper';
import { NgClass } from '@angular/common';

@Component({
    selector: 'section-contact-us-items',
    imports: [EmptyFieldMessage, ButtonModule,  InputTextModule, TextareaModule, NgClass],
    templateUrl: './section-contact-us-items.html'
})
export class SectionContactUsItems {
    section = input.required<Section>();
    currentSectionItem = input<SectionItem | null>(null);
    contextMenu = input<ContextMenuCrud<SectionItem>>();
    isPreview = input<boolean>(false);

    InputType = InputType;
}
