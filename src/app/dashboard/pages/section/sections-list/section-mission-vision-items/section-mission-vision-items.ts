import type { Section } from '@/shared/interfaces/section';
import { Component, input, output, signal, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';
import { MenuModule } from 'primeng/menu';
import { DeleteSectionItemFunction } from '../sections-list';
import type { SectionItem } from '@/shared/interfaces/section-item';
import type  { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';

@Component({
  selector: 'section-mission-vision-items',
  imports: [ContextMenuCrud, EmptyFieldMessage, CardModule, ButtonModule],
  templateUrl: './section-mission-vision-items.html',
})
export class SectionMissionVisionItems {
  section = input.required<Section>();
   deleteItemConfirmation = input.required<DeleteSectionItemFunction>();
    onSelectSectionItem = output<SectionItem>();

    @ViewChild(ContextMenuCrud) contextMenu!: ContextMenuCrud;

    selectedItem = signal<SectionItem | null>(null);

    edit = () => {
        this.onSelectSectionItem.emit(this.selectedItem()!);
    }
    
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
    }
}
