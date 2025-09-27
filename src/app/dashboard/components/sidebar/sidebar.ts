import { Component, ElementRef } from '@angular/core';

import { Menu } from './menu/menu';

@Component({
    selector: 'dashboard-sidebar',
    standalone: true,
    imports: [Menu],
    template: `<div class="layout-sidebar">
        <dashboard-menu></dashboard-menu>
    </div>`
})
export class Sidebar {
    constructor(public el: ElementRef) {}
}
