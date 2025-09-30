import { type MenuType } from '@/dashboard/interfaces/menu';
import { MenuFormService } from '@/dashboard/services/menu-form.service';
import { FormUtils } from '@/utils/form-utils';
import { Component, computed, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'upsert-menu-basic-info-form',
    templateUrl: './basic-info-form.html',
    imports: [InputTextModule, InputNumberModule, SelectModule, ReactiveFormsModule]
})
export class BasicInfoForm {
    private readonly fb = inject(FormBuilder);
    private readonly menuFormService = inject(MenuFormService);

    FormUtils = FormUtils;
    
    form = this.menuFormService.form;

    menusType = computed<MenuType[]>(() => this.menuFormService.menusType());

    selectedMenuType =  this.menuFormService.selectedMenuType;

    

    // TODO: Check this repository to implement the form validation: https://github.com/DevTalles-corp/angular-reactive-forms/tree/fin-seccion-15
}
