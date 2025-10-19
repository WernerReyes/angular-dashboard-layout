import { Section } from '@/shared/interfaces/section';
import { Component, input, output, signal, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { DeleteSectionItemFunction } from '../sections-list';
import { SectionItem } from '@/shared/interfaces/section-item';
import { MenuModule } from 'primeng/menu';
import { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';

@Component({
    selector: 'section-cash-processing-equipment-items',
    imports: [ContextMenuCrud, EmptyFieldMessage, ButtonModule, MenuModule],
    templateUrl: './section-cash-processing-equipment-items.html'
})
export class SectionCashProcessingEquipmentItems {
    section = input.required<Section>();

    @ViewChild(ContextMenuCrud) contextMenu!: ContextMenuCrud<SectionItem>;

    deleteItemConfirmation = input.required<DeleteSectionItemFunction>();

    onSelectSectionItem = output<SectionItem>();
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
