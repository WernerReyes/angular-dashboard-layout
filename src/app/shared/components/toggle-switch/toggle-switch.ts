import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'app-toggle-switch',
    imports: [ToggleSwitchModule, FormsModule],
    template: `
        @if (text()) {
            <div class="flex items-center mt-5">
                <p-toggleswitch [(ngModel)]="checked" />
                <span class="ml-2 font-bold">{{ text() }}</span>
            </div>
        } @else {
            <p-toggleswitch [(ngModel)]="checked" />
        }
    `
})
export class ToggleSwitch {
    text = input<string>();
    checked = input.required<boolean>();
}
