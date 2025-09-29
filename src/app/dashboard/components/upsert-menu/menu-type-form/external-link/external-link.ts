import { MenuFormService } from '@/dashboard/services/menu-form.service';
import { ToggleSwitch } from '@/shared/components/toggle-switch/toggle-switch';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'menu-type-external-link',
    imports: [ToggleSwitchModule, InputTextModule, ReactiveFormsModule],
    templateUrl: './external-link.html'
})
export class ExternalLink {
    private readonly menuFormService = inject(MenuFormService);
    form = this.menuFormService.form;
    checked = signal(true);
}
