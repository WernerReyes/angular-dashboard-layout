import { ToggleSwitch } from '@/shared/components/toggle-switch/toggle-switch';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { OrderListModule } from 'primeng/orderlist';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'menu-type-dropdown',
    imports: [ToggleSwitch, OrderListModule, SelectModule, FormsModule, ButtonModule, InputTextModule],
    templateUrl: './dropdown.html'
})
export class Dropdown {
    checked = signal(true);

    ngAfterViewInit() {
        document.querySelector('.p-orderlist-controls')?.classList.add('!hidden');
    }

    dropdownItems = signal<Array<{ id: number; title: string; link: string }>>([{ id: 1, title: '', link: '' }]);

    handleAddDropdownItem() {
        const currentItems = this.dropdownItems();
        const newItem = { id: currentItems.length + 1, title: '', link: '' };
        this.dropdownItems.update((items) => [...items, newItem]);
    }
}
