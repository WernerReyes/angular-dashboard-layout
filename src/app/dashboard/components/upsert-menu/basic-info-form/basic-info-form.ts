import type { MenuType } from '@/dashboard/interfaces/menu';
import { Component, computed, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'upsert-menu-basic-info-form',
    templateUrl: './basic-info-form.html',
    imports: [InputTextModule, SelectModule, FormsModule]
})
export class BasicInfoForm implements OnInit {
    onSelectedMenuType = output<MenuType>();

    menusType = computed<MenuType[]>(() => [
        { name: 'Página Interna', code: 'internal-page' },
        { name: 'Enlace Externo', code: 'external-link' },
        { name: 'Dropdown', code: 'dropdown' }
    ]);

    selectedMenuType = signal<MenuType>(this.menusType()[2]);

    ngOnInit() {
        this.onSelectedMenuType.emit(this.selectedMenuType());
    }
}
