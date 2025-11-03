import { Menu, menuActiveStatusOptions } from '@/shared/interfaces/menu';
import { Component, input } from '@angular/core';
import { LinkType } from '@/shared/mappers/link.mapper';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'menu-item',
  imports: [TagModule, ButtonModule],
  templateUrl: './menu-item.html',
})
export class MenuItem {
 menuItem = input.required<Menu & { expanded?: boolean }>();
 openDialogAndEdit = input.required<(menu: Menu) => void>();
 confirmDeleteMenu = input.required<(event: Event, menu: Menu) => void>();
 
  menuActiveStatus = menuActiveStatusOptions;
  LinkType = LinkType;

  toggleExpand() {
    this.menuItem().expanded = !this.menuItem().expanded;
  }

  
}
