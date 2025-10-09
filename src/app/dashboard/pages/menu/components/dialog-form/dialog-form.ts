import { LinkService } from '@/dashboard/services/link.service';
import { MenuService } from '@/dashboard/services/menu.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import type { Menu } from '@/shared/interfaces/menu';
import { FormUtils } from '@/utils/form-utils';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MenuFormService } from '../../services/menu-form.service';
import { CreateMenu } from '@/dashboard/interfaces/menu';
import { LinkType } from '@/shared/mappers/link.mapper';
import { FilterLinksByTypePipe } from '@/dashboard/pipes/filter-links-by-type-pipe';

@Component({
    selector: 'link-dialog-form',
    imports: [FilterLinksByTypePipe, DialogModule, ErrorBoundary, FormsModule, ReactiveFormsModule,  ToggleButtonModule, InputTextModule, MessageModule, SelectModule, SelectButtonModule, ButtonModule],
    templateUrl: './dialog-form.html'
})
export class DialogForm {
    private readonly menuFormService = inject(MenuFormService);
    private readonly linkService = inject(LinkService);
    private readonly menuService = inject(MenuService);

    linksList = this.linkService.linksListResource;
    menusList = this.menuService.menuListResource;

    form = this.menuFormService.form;

    menuParentsList = computed(() => {
        const parents = (this.menusList.value() || []).filter((menu) => menu.parentId === null);
        return [{ id: null, title: 'Sin padre (Nivel superior)' }, ...parents];
    });

    onCloseDialog = output<void>();
    display = input.required<boolean>();

    FormUtils = FormUtils;

    selectedMenu = input<Menu | null>();

     checked = signal<boolean>(false);

 

    saveChanges() {
        if (this.form.valid) {
            const menuData = this.form.value;
            const menu: CreateMenu = {
                title: menuData.title!,
                linkId: menuData.linkId!,
                parentId: menuData.parentId || null,
                active: menuData.active === true
            };

    
            if (this.selectedMenu()) {
                this.menuService.updateMenu(this.selectedMenu()!.id, menu).subscribe({
                    next: () => {
                        this.onCloseDialog.emit();
                        this.menuFormService.reset();
                    }
                });

                return;
            }
            this.menuService.createMenu(menu).subscribe({
                next: () => {
                    this.onCloseDialog.emit();
                    this.menuFormService.reset();
                }
            });
        }
    }
}
