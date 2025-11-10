import type { CreateMenu } from '@/dashboard/interfaces/menu';
import { FilterLinksByTypePipe } from '@/dashboard/pipes/filter-links-by-type-pipe';
import { LinkService } from '@/dashboard/services/link.service';
import { MenuService } from '@/dashboard/services/menu.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { linkTypeOptions } from '@/shared/interfaces/link';
import type { Menu } from '@/shared/interfaces/menu';
import { FormUtils } from '@/utils/form-utils';
import { KeyValuePipe } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TreeSelectModule } from 'primeng/treeselect';
import { MenuFormService } from '../../services/menu-form.service';

@Component({
    selector: 'link-dialog-form',
    imports: [FilterLinksByTypePipe, DialogModule, ErrorBoundary, KeyValuePipe, FormsModule, ReactiveFormsModule, TreeSelectModule, ToggleButtonModule, InputTextModule, MessageModule, SelectModule, SelectButtonModule, ButtonModule],
    templateUrl: './dialog-form.html'
})
export class DialogForm {
    private readonly menuFormService = inject(MenuFormService);
    private readonly linkService = inject(LinkService);
    private readonly menuService = inject(MenuService);

    linksList = this.linkService.linksListResource;
    menusList = this.menuService.menuListResource;
    form = this.menuFormService.form;
    linkTypeOptions = linkTypeOptions;
    FormUtils = FormUtils;

    selectedMenu = input<Menu | null>();
    display = input.required<boolean>();
    onCloseDialog = output<void>();

    private linkId = toSignal(this.form.get('linkId')!.valueChanges, { initialValue: this.form.get('linkId')!.value });
    checked = signal<boolean>(false);

    menuParentsList = computed(() => {
        const parents = (this.menusList.value() || []).filter((menu) => menu.parentId === null);
        return [{ id: null, title: 'Sin padre (Nivel superior)' }, ...parents];
    });

    menusListSelect = computed<TreeNode[]>(() => {
        const menus = this.menusList.hasValue() ? this.menusList.value() : [];

        const buildTree = (items: any[]): TreeNode[] => {
            return items.map((item) => ({
                label: item.title,
                data: item.id,
                key: String(item.id),
                children: item.children && item.children.length > 0 ? buildTree(item.children) : undefined
            }));
        };

        return buildTree(menus);
    });

    private setDefaultMenuTitle = effect(() => {
        const linkId = this.linkId();
        const currentTitle = this.form.get('title')!;
        // if (!currentTitle || currentTitle.value.trim() === '') {
            const link = this.linksList.hasValue() ? this.linksList.value().find((l) => l.id === linkId) : null;
            if (link) {
                currentTitle.setValue(link.title);
            }
        // }
    });

    saveChanges() {
        if (this.form.valid) {
            const menuData = this.form.value;
            const menu: CreateMenu = {
                title: menuData.title!,
                linkId: menuData.linkId!,
                parentId: menuData.parentId ? (typeof menuData.parentId === 'object' ? (menuData.parentId as TreeNode).data : menuData.parentId) : null,
             
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
