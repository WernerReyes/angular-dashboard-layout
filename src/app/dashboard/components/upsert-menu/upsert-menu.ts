import { Component, computed, input, signal } from '@angular/core';
import { BasicInfoForm } from './basic-info-form/basic-info-form';
import { FluidModule } from 'primeng/fluid';
import { MenuTypeForm } from './menu-type-form/menu-type-form';
import type { MenuType } from '@/dashboard/interfaces/menu';

@Component({
    selector: 'upsert-menu',
    imports: [BasicInfoForm, MenuTypeForm, FluidModule],
    templateUrl: './upsert-menu.html'
})
export class UpsertMenu {
    selectedMenuType = signal<MenuType>(undefined!);
}
