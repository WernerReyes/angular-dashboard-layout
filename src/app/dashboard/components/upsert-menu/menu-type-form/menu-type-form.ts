import { MenuFormService } from '@/dashboard/services/menu-form.service';
import { Component, forwardRef, inject } from '@angular/core';
import { Dropdown } from './dropdown/dropdown';
import { ExternalLink } from './external-link/external-link';
import { InternalPage } from './internal-page/internal-page';

@Component({
    selector: 'upsert-menu-type-form',
    imports: [
        forwardRef(() => InternalPage)
        , ExternalLink, Dropdown],
    templateUrl: './menu-type-form.html',
    
})
export class MenuTypeForm {
    menuFormService = inject(MenuFormService);
    selectedMenuType = this.menuFormService.selectedMenuType;
    
}
