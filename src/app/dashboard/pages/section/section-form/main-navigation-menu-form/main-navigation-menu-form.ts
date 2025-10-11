import { Component, computed, inject } from '@angular/core';
import { SectionFormService } from '../../services/section-form.service';
import { CommonInputs } from '../../components/common-inputs/common-inputs';
import { FileUpload } from '../../components/file-upload/file-upload';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { MenuService } from '@/dashboard/services/menu.service';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'main-navigation-menu-form',
    imports: [ErrorBoundary, CommonInputs, FileUpload, ReactiveFormsModule, MultiSelectModule],
    templateUrl: './main-navigation-menu-form.html'
})
export class MainNavigationMenuForm {
    private readonly menuService = inject(MenuService);
    private readonly sectionFormService = inject(SectionFormService);
    form = this.sectionFormService.form;

    menuList = this.menuService.menuListResource;

    menusListSelect = computed<MenuItem[]>(() => {
        const menus = this.menuList.hasValue() ? this.menuList.value() : [];
        return menus.map(menu => ({
            label: menu.title,
            value: menu.id,
            items: []
        }));
    });
}
