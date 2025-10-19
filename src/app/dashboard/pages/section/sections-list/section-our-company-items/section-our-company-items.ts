import { Component, input, output, signal, ViewChild } from '@angular/core';
import type { Section } from '@/shared/interfaces/section';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import type { DeleteSectionItemFunction } from '../sections-list';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';

@Component({
    selector: 'section-our-company-items',
    imports: [ContextMenuCrud, EmptyFieldMessage, MenuModule, ButtonModule],
    templateUrl: './section-our-company-items.html'
})
export class SectionOurCompanyItems {
    section = input.required<Section>();
    deleteItemConfirmation = input.required<DeleteSectionItemFunction>();
    onSelectSectionItem = output<SectionItem>();

    @ViewChild(ContextMenuCrud) contextMenu!: ContextMenuCrud<SectionItem>;

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
    }
}
