
import { AppConfigurator } from '@/shared/components/configurator/configurator';
import { LayoutService } from '@/shared/services/layout.service';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
    selector: 'dashboard-topbar',
    imports: [RouterModule, StyleClassModule, AppConfigurator],
    templateUrl: './topbar.html'
})
export class Topbar {
    readonly layoutService = inject(LayoutService);

    items!: MenuItem[];

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
