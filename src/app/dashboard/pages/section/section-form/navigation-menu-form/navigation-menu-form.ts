import { MenuService } from '@/dashboard/services/menu.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { FormUtils } from '@/utils/form-utils';
import { Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import type { TreeNode } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { TreeSelectModule } from 'primeng/treeselect';
import { FileUpload } from '../../components/file-upload/file-upload';
import { SectionFormService } from '../../services/section-form.service';

@Component({
    selector: 'navigation-menu-form',
    imports: [ErrorBoundary, FileUpload, ReactiveFormsModule, MultiSelectModule, TreeSelectModule, MessageModule],
    templateUrl: './navigation-menu-form.html'
})
export class NavigationMenuForm {
    private readonly menuService = inject(MenuService);
    private readonly sectionFormService = inject(SectionFormService);

    form = this.sectionFormService.form;

    menuList = this.menuService.menuListResource;

    menusListSelect = computed<TreeNode[]>(() => {
        const menus = this.menuList.hasValue() ? this.menuList.value() : [];
        return menus.map((menu) => ({
            label: menu.title,
            data: menu.id,
            key: String(menu.id),
            // partialSelectable: !(menu.children && menu.children.length > 0),
            selectable: !(menu.children && menu.children.length > 0),

            children: menu.children?.map((child) => ({ label: child.title, key: String(child.id), data: child.id }))
        }));
    });

    FormUtils = FormUtils;
}
