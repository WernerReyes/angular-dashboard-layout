import { MenuUtils } from '@/dashboard/utils/menu.utils';
import { Menu } from '@/shared/interfaces/menu';
import { Section } from '@/shared/interfaces/section';
import { Component, computed, input, output, signal, ViewChild } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DeleteSectionItemFunction } from '../sections-list';
import { SectionItem } from '@/shared/interfaces/section-item';
import { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';

@Component({
    selector: 'section-footer-items',
    imports: [ContextMenuCrud, MenuModule, ButtonModule],
    templateUrl: './section-footer-items.html'
})
export class SectionFooterItems {
    section = input.required<Section>();
    deleteItemConfirmation = input.required<DeleteSectionItemFunction>();
    onSelectSectionItem = output<SectionItem>();

    @ViewChild(ContextMenuCrud) contextMenu!: ContextMenuCrud<SectionItem>;

    selectedItem = signal<SectionItem | null>(null);

    currentYear = new Date().getFullYear();


    menus = computed<MenuItem[]>(() => {
        const sectionData = this.section();
        if (!sectionData?.menus) {
            return [];
        }

        const menus = MenuUtils.buildMenuTree(sectionData.menus);

        return menus.map((menu) => ({
            id: menu.id.toString(),
            label: menu.title,
            items: menu.children?.length
                ? menu.children.map((child) => ({
                      id: child.id.toString(),
                      label: child.title
                  }))
                : undefined
        }));
    });

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
