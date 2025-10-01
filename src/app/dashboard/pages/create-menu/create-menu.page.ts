import { UpsertMenu } from '@/dashboard/components/upsert-menu/upsert-menu';
import { CreateMenu, MenuTypes } from '@/dashboard/interfaces/menu';
import { MenuFormService } from '@/dashboard/services/menu-form.service';
import { MenuService } from '@/dashboard/services/menu.service';
import { PageService } from '@/dashboard/services/page.service';
import { Component, computed, effect, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { ToastModule } from 'primeng/toast';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
    selector: 'app-create-menu.page',
    imports: [UpsertMenu, FluidModule, ButtonModule, RouterLink, ReactiveFormsModule, ToastModule],
    templateUrl: './create-menu.page.html',
    providers: [MessageService]
})
export default class UpsertMenuPage {
    private readonly messageService = inject(MessageService);
    private readonly menuService = inject(MenuService);
    private readonly pageService = inject(PageService);
    readonly menuFormService = inject(MenuFormService);
    private readonly route = inject(ActivatedRoute);

    private paramMap = toSignal(this.route.paramMap);

    menuId = computed(() => {
        const id = this.paramMap()?.get('id');
        return id ? Number(id) : null;
    });

    errorMessage = this.menuService.errorMessage;

    menuExists = computed(() => !!this.menuService.currentMenu());

    constructor() {}

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
            };

            this.menuService.createMenu(format).subscribe({
                next: () => {
                    this.menuFormService.form.reset();
                    this.pageService.pagesList.update((pages) => {
                        return pages.filter((page) => menuData.pageId !== page.id);
                    });
                    if (format.dropdownArray && format.dropdownArray.length > 0) {
                        this.pageService.pagesList.update((pages) => {
                            return pages.filter((page) => !format.dropdownArray?.some((item) => item.pageId === page.id));
                        });
                    }
                }
            });
        }
    }

    private sendRequest = effect(() => {
        if (this.menuId()) {
            this.menuService.getById(this.menuId()!).subscribe();
        }
    });

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
