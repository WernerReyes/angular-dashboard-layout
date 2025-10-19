import type { Section } from '@/shared/interfaces/section';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { InputType } from '@/shared/mappers/section-item.mapper';
import { Component, input, output, signal, ViewChild } from '@angular/core';
import type { MenuItemCommandEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import type { DeleteSectionItemFunction } from '../sections-list';

@Component({
    selector: 'section-contact-us-items',
    imports: [ContextMenuCrud, EmptyFieldMessage, ButtonModule,  InputTextModule, TextareaModule],
    templateUrl: './section-contact-us-items.html'
})
export class SectionContactUsItems {
    section = input.required<Section>();
    deleteItemConfirmation = input.required<DeleteSectionItemFunction>();
    onSelectSectionItem = output<SectionItem>();

    @ViewChild(ContextMenuCrud) contextMenu!: ContextMenuCrud<SectionItem>;

    InputType = InputType;

    selectedItem = signal<SectionItem | null>(null);

    edit = () => {
        this.onSelectSectionItem.emit(this.selectedItem()!);
    };

    delete = (event: MenuItemCommandEvent) => {
        this.deleteItemConfirmation()(
            event.originalEvent!,
            {
                id: this.selectedItem()!.id,
                sectionId: this.section().id
            },
            () => {
                this.selectedItem.set(null);
            }
        );
    };
}
