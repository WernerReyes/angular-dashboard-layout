import type { Section } from '@/shared/interfaces/section';
import { SectionItem } from '@/shared/interfaces/section-item';
import { Component, input, output, signal, ViewChild } from '@angular/core';
import type { MenuItemCommandEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import type { DeleteSectionItemFunction } from '../sections-list';

@Component({
    selector: 'section-why-us-items',
    imports: [ContextMenuCrud, EmptyFieldMessage, CardModule,  ButtonModule],
    templateUrl: './section-why-us-items.html'
})
export class SectionWhyUsItems {
    section = input.required<Section>();
    deleteItemConfirmation = input.required<DeleteSectionItemFunction>();
    onSelectSectionItem = output<SectionItem>();

    selectedItem = signal<SectionItem | null>(null);

    @ViewChild(ContextMenuCrud) contextMenu!: ContextMenuCrud;

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
