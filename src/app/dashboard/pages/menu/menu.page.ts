import { Menu } from '@/dashboard/components/menu/menu';
import { MenuFormService } from '@/dashboard/services/menu-form.service';
import { PageService } from '@/dashboard/services/page.service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-menu.page',
    imports: [
    Menu,
    ButtonModule,
],
    templateUrl: './menu.page.html',
    styleUrl: './menu.page.scss'
})
export default class MenuPage {
    private readonly menuFormService = inject(MenuFormService);
    private readonly pageService = inject(PageService);
    private readonly router = inject(Router);
    goToNewMenu() {
        this.menuFormService.form.reset();
        this.pageService.pageIdsActived.set(null);
        this.router.navigate(['/dashboard/menu/new']);
    }
}
