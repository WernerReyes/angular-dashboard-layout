import { MenuService } from '@/dashboard/services/menu.service';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-create-page.page',
    imports: [FluidModule, ButtonModule, RouterLink, TagModule, InputTextModule, SelectModule, DividerModule],
    templateUrl: './create-page.page.html'
})
export default class CreatePagePage {
    private readonly menuService = inject(MenuService);

    statusOptions = computed(() => [
        { label: 'Borrador', value: 'DRAFT' },
        { label: 'Publicado', value: 'PUBLISHED' }
    ]);

    sectionsOptions = computed(() => [
        { label: 'Hero', value: 'HERO' },
        { label: 'Cuerpo', value: 'BODY' },
        { label: 'Pie de página', value: 'FOOTER' }
    ]);
}
