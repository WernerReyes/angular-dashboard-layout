import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuList } from './components/menu-list/menu-list';
import { MenuFormService } from './services/menu-form.service';
import { DialogForm } from './components/dialog-form/dialog-form';
import type { Menu } from '@/shared/interfaces/menu';

@Component({
    selector: 'app-menu.page',
    imports: [MenuList, DialogForm, ButtonModule],
    templateUrl: './menu.page.html'
})
export default class MenuPage {
    private readonly menuFormService = inject(MenuFormService);

    selectedMenu = signal<Menu | null>(null);

    display = signal<boolean>(false);

    closeDialog() {
        this.display.set(false);
        this.menuFormService.reset();
        this.selectedMenu.set(null);
    }
}
