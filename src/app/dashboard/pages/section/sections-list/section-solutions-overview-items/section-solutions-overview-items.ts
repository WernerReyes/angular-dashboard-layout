import type { Section } from '@/shared/interfaces/section';
import { Component, input, output, signal, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import { DeleteSectionItemFunction } from '../sections-list';
import { SectionItem } from '@/shared/interfaces/section-item';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';

@Component({
    selector: 'section-solutions-overview-items',
    imports: [ContextMenuCrud, ButtonModule, CardModule, EmptyFieldMessage, MenuModule],
    templateUrl: './section-solutions-overview-items.html'
})
export class SectionSolutionsOverviewItems {
    section = input.required<Section>();
    deleteItemConfirmation = input.required<DeleteSectionItemFunction>();
    onSelectSectionItem = output<SectionItem>();

    @ViewChild(ContextMenuCrud) contextMenu!: ContextMenuCrud;

    selectedItem = signal<SectionItem | null>(null);

    edit = () => {
        this.onSelectSectionItem.emit(this.selectedItem()!);
    };

    delete = (event: MenuItemCommandEvent) => {
        this.deleteItemConfirmation()(
            event.originalEvent!,
            {
                id: this.selectedItem()!.id,
                sectionId: this.selectedItem()!.sectionId
            },
            () => {
                this.selectedItem.set(null);
            }
        );
    };
}
