import type { MenuType } from '@/dashboard/interfaces/menu';
import { Component, signal } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
import { BasicInfoForm } from './basic-info-form/basic-info-form';
import { MenuTypeForm } from './menu-type-form/menu-type-form';

@Component({
    selector: 'upsert-menu',
    imports: [BasicInfoForm, MenuTypeForm, FluidModule],
    templateUrl: './upsert-menu.html'
})
export class UpsertMenu {
    selectedMenuType = signal<MenuType>(undefined!);
}
