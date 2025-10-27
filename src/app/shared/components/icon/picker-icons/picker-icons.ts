import { Component, inject, output, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { FilterByPipe } from '@/shared/pipes/filter-by-pipe';
import { FormsModule } from '@angular/forms';
import lucideData from '@iconify-json/lucide/icons.json';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';
import { PopoverModule } from 'primeng/popover';
import type { Icon } from '@/shared/mappers/section-item.mapper';



@Component({
    selector: 'app-picker-icons',
    imports: [FilterByPipe, FormsModule, InputTextModule, ButtonModule, InputGroupAddonModule, InputGroupModule, SliderModule, ColorPickerModule, PopoverModule],
    templateUrl: './picker-icons.html',
})
export class PickerIcons {
    private readonly sanitizer = inject(DomSanitizer);

    selectedIcon = signal<Icon | null>(null);
    onSelectedIcon = output<Icon>();

    icons = Object.entries(lucideData.icons).map(([name, icon], i) => ({
        name,
        icon: this.sanitizer.bypassSecurityTrustHtml(icon.body.replace(/stroke-width="[^"]*"/g, '')),
        id: i
    }));

    filterText = signal<string>('');
    size = signal<number>(24);
    color = signal<string>('#000000');
    strokeWidth = signal<number>(2);

    reset() {
        this.size.set(24);
        this.color.set('#000000');
        this.strokeWidth.set(2);
    }

    setSelectedIcon(name: string) {
        if (this.selectedIcon() && this.selectedIcon()!.name === name) {
            this.selectedIcon.set(null);
            this.onSelectedIcon.emit(null!);
            return;
        }
        this.selectedIcon.set({
            name,
            size: this.size(),
            color: this.color(),
            strokeWidth: this.strokeWidth()
        });
        this.onSelectedIcon.emit(this.selectedIcon()!);
    }
}
