import { ToggleSwitch } from '@/auth/components/toggle-switch/toggle-switch';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-internal-page',
  imports: [SelectModule, FormsModule, ToggleSwitch],
  templateUrl: './internal-page.html',
})
export class InternalPage {
   checked = true;
}
