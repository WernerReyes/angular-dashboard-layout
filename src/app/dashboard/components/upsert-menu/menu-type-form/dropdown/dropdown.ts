import { MenuFormService } from '@/dashboard/services/menu-form.service';
import { FormUtils } from '@/utils/form-utils';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { OrderListModule } from 'primeng/orderlist';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ExternalLink } from '../external-link/external-link';
import { InternalPage } from '../internal-page/internal-page';
@Component({
    selector: 'menu-type-dropdown',
    imports: [ DragDropModule, ToggleSwitchModule, OrderListModule, MessageModule, SelectModule, FormsModule, ButtonModule, InputTextModule, InternalPage, ExternalLink, ReactiveFormsModule],
    templateUrl: './dropdown.html',
    styleUrl: './dropdown.scss'
})
export class Dropdown {
    private readonly menuFormService = inject(MenuFormService);

    form = this.menuFormService.form;

    FormUtils = FormUtils;


    dropdownType = this.menuFormService.dropdownType;

    get dropdownItems() {
        return this.menuFormService.dropdownItems;
    }

   
    handleAddDropdownItem() {
        this.menuFormService.addDropdown();
    }

    handleRemoveDropdownItem(index: number) {
        this.menuFormService.removeDropdown(index);
    }

    drop(event: any) {
        // Mover los controles en el FormArray
        const draggedControl = this.dropdownItems.at(event.previousIndex);
        this.dropdownItems.removeAt(event.previousIndex);
        this.dropdownItems.insert(event.currentIndex, draggedControl);

        // Actualizar el campo 'order' en cada elemento después del reordenamiento
        this.updateItemsOrder();

        // Forzar actualización del FormArray
        this.dropdownItems.updateValueAndValidity();
    }

    private updateItemsOrder() {
        this.dropdownItems.controls.forEach((control, index) => {
            // Si tienes un campo 'order' en tu FormGroup
            if (control.get('order')) {
                control.get('order')?.setValue(index + 1);
            }
        });
    }
}
