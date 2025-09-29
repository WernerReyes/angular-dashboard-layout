import { MenuFormService } from '@/dashboard/services/menu-form.service';
import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { OrderListModule } from 'primeng/orderlist';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ExternalLink } from '../external-link/external-link';
import { InternalPage } from '../internal-page/internal-page';
import { FormUtils } from '@/utils/form-utils';
import { MessageModule } from 'primeng/message';
import {CdkDrag, CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';
@Component({
    selector: 'menu-type-dropdown',
    imports: [DragDropModule, ToggleSwitchModule, OrderListModule, MessageModule, SelectModule, FormsModule, ButtonModule, InputTextModule, InternalPage, ExternalLink, ReactiveFormsModule],
    templateUrl: './dropdown.html',
    styleUrl: './dropdown.scss'
})
export class Dropdown {
    private readonly menuFormService = inject(MenuFormService);

    form = this.menuFormService.form;

    FormUtils = FormUtils;

    // ngAfterViewInit() {
    //     document.querySelector('.p-orderlist-controls')?.classList.add('!hidden');
    // }

    dropdownType = this.menuFormService.dropdownType;

    dropdownItems = this.menuFormService.dropdownItems;

    handleAddDropdownItem() {
        this.menuFormService.addDropdown();
    }

    handleRemoveDropdownItem(index: number) {
        this.menuFormService.removeDropdown(index);
    }

    drop(event: any) {
        console.log(event);
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
