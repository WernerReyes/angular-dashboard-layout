import { MenuType } from '@/dashboard/interfaces/menu';
import { PageService } from '@/dashboard/services/page.service';
import { Component, input, signal, effect, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { OrderListModule } from 'primeng/orderlist';
import { Button } from 'primeng/button';
import { BasicInfoForm } from '../basic-info-form/basic-info-form';

@Component({
    selector: 'upsert-menu-type-form',
    imports: [SelectModule, FormsModule, InputTextModule, ToggleSwitchModule, OrderListModule, Button],
    templateUrl: './menu-type-form.html'
})
export class MenuTypeForm {
    private readonly pageService = inject(PageService);

    selectedMenuType = input.required<MenuType>();

    pages = computed(() => this.pageService.pagesList());

    selectedPage = signal(undefined);

    checked: boolean = true;

    

    dropdownItems = signal<Array<{ id: number; title: string; link: string }>>([
        { id: 1, title: '', link: '' },
    ]);
    
    ngAfterViewInit() {
      document.querySelector('.p-orderlist-controls')?.classList.add('!hidden');
    }


    handleAddDropdownItem() {
        const currentItems = this.dropdownItems();
        const newItem = { id: currentItems.length + 1, title: '', link: '' };
        this.dropdownItems.update((items) => [...items, newItem]);
    }

   

}
