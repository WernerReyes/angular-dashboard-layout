import { MenuType } from '@/dashboard/interfaces/menu';
import { Component, effect, inject, input } from '@angular/core';
import { Dropdown } from './dropdown/dropdown';
import { ExternalLink } from './external-link/external-link';
import { InternalPage } from './internal-page/internal-page';
import { MenuFormService } from '@/dashboard/services/menu-form.service';

@Component({
    selector: 'upsert-menu-type-form',
    imports: [InternalPage, ExternalLink, Dropdown],
    templateUrl: './menu-type-form.html'
})
export class MenuTypeForm {
    menuFormService = inject(MenuFormService);
    selectedMenuType = this.menuFormService.selectedMenuType;
    
}
