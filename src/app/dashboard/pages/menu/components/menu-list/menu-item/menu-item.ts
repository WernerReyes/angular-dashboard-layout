import type { Menu } from '@/shared/interfaces/menu';
import { LinkType } from '@/shared/mappers/link.mapper';
import { DatePipe, NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'menu-item',
  imports: [NgClass, DatePipe, ButtonModule],
  templateUrl: './menu-item.html',
})
export class MenuItem {
 menuItem = input.required<Menu & { expanded?: boolean }>();
 
 onContextMenu = input.required<(event: any, menu: Menu) => void>(); 
 currentMenu = input<Menu | null>();
 
  
  LinkType = LinkType;

  toggleExpand() {
    this.menuItem().expanded = !this.menuItem().expanded;
  }

  
}
