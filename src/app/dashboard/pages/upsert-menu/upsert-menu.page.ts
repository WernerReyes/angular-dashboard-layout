import { UpsertMenu } from '@/dashboard/components/upsert-menu/upsert-menu';
import { MenuFormService } from '@/dashboard/services/menu-form.service';
import { MenuService } from '@/dashboard/services/menu.service';
import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { ToastModule } from 'primeng/toast';
import { JsonPipe } from '@angular/common';
import { PageService } from '@/dashboard/services/page.service';
import { CreateMenu, MenuTypes } from '@/dashboard/interfaces/menu';

@Component({
    selector: 'app-upsert-menu.page',
    imports: [UpsertMenu, FluidModule, ButtonModule, RouterLink, ReactiveFormsModule, ToastModule],
    templateUrl: './upsert-menu.page.html',
    styleUrl: './upsert-menu.page.scss',
    providers: [MessageService]
})
export default class UpsertMenuPage {
    private readonly messageService = inject(MessageService);
    private readonly menuService = inject(MenuService);
    private readonly pageService = inject(PageService);
    readonly menuFormService = inject(MenuFormService);

    errorMessage = this.menuService.errorMessage;

    createMenu() {
        if (this.menuFormService.form.valid) {
            const menuData = this.menuFormService.form.getRawValue();
            const format: CreateMenu = {
                title: menuData.title,
                order: menuData.order,
                menuType: menuData.menuType as MenuTypes,
                pageId: menuData.pageId,
                active: menuData.active,
                url: menuData.url,
                dropdownArray: menuData.dropdownItems as any
            }

            console.log(format);
            this.menuService.createMenu(format).subscribe({
                next: () => {
                    this.menuFormService.form.reset();
                    this.pageService.pagesList.update((pages) => {
                        return pages.filter((page) => menuData.pageId !== page.id);
                    });
                }
            });
        }
    }
    
    

    private showError = effect(() => {
        if (this.errorMessage()) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: this.errorMessage()! });
            this.menuService.errorMessage.set(null);
        }
    });

    private showSuccess = effect(() => {
        if (this.menuService.successMessage()) {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: this.menuService.successMessage()! });
            this.menuService.successMessage.set(null);
        }
    });
}
