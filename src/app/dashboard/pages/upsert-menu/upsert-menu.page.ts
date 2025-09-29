import { UpsertMenu } from '@/dashboard/components/upsert-menu/upsert-menu';
import { MenuFormService } from '@/dashboard/services/menu-form.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';

@Component({
    selector: 'app-upsert-menu.page',
    imports: [UpsertMenu, FluidModule, ButtonModule, RouterLink, ReactiveFormsModule],
    templateUrl: './upsert-menu.page.html',
    styleUrl: './upsert-menu.page.scss'
})
export default class UpsertMenuPage {
    readonly menuFormService = inject(MenuFormService);

    createMenu() {
        if (this.menuFormService.form.valid) {
            console.log(this.menuFormService.form.getRawValue());
        }
    }
    
}
