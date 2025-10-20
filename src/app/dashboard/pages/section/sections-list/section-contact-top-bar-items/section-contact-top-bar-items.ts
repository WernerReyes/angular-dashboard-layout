import { ImageError } from '@/shared/components/error/image/image';
import type { Section } from '@/shared/interfaces/section';
import { SectionItem } from '@/shared/interfaces/section-item';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import type { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
import { EmptyFieldMessage } from '../../components/empty-field-message/empty-field-message';

@Component({
    selector: 'section-contact-top-bar-items',
    imports: [EmptyFieldMessage, ImageError, MenuModule, ButtonModule],
    templateUrl: './section-contact-top-bar-items.html'
})
export class SectionContactTopBarItems {
    section = input.required<Section>();
    contextMenu = input.required<ContextMenuCrud<SectionItem>>();
    // deleteItemConfirmation = input.required<DeleteSectionItemFunction>();
    // onSelectSectionItem = output<SectionItem>();

    // @ViewChild(ContextMenuCrud) contextMenu!: ContextMenuCrud<SectionItem>;

    // selectedItem = signal<SectionItem | null>(null);

    // edit = () => {
    //     this.onSelectSectionItem.emit(this.selectedItem()!);
    // };

    // delete = (event: MenuItemCommandEvent) => {
    //     this.deleteItemConfirmation()(
    //         event.originalEvent!,
    //         {
    //             id: this.selectedItem()!.id,
    //             sectionId: this.section().id
    //         },
    //         () => {
    //             this.selectedItem.set(null);
    //         }
    //     );
    // };
}
