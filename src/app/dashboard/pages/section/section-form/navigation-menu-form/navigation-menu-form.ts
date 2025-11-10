import { MenuService } from '@/dashboard/services/menu.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { FormUtils } from '@/utils/form-utils';
import { Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import type { TreeNode } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { TreeSelectModule } from 'primeng/treeselect';
import { FileUpload } from '../../components/file-upload/file-upload';
import { SectionFormService } from '../../services/section-form.service';

@Component({
    selector: 'navigation-menu-form',
    imports: [ErrorBoundary, FileUpload, ReactiveFormsModule, TreeSelectModule, MessageModule],
    templateUrl: './navigation-menu-form.html'
})
export class NavigationMenuForm {
    private readonly menuService = inject(MenuService);
    private readonly sectionFormService = inject(SectionFormService);

    form = this.sectionFormService.form;
    menuList = this.menuService.menuListResource;
    FormUtils = FormUtils;

   menusListSelect = computed<TreeNode[]>(() => {
    const menus = this.menuList.hasValue() ? this.menuList.value() : [];

    const buildTree = (items: any[]): TreeNode[] => {
        return items.map((item) => ({
            label: item.title,
            data: item.id,
            key: String(item.id),
            selectable: !(item.children && item.children.length > 0),
            children: item.children && item.children.length > 0 ? buildTree(item.children) : undefined,
        }));
    };

    return buildTree(menus);
});


    

    

}
