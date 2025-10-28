import { Component, effect, input, linkedSignal, output } from '@angular/core';

import { FilterByPipe } from '@/shared/pipes/filter-by-pipe';
import { FormsModule } from '@angular/forms';

import { type IconName, Icons } from '@/shared/constants/icons';
import type { Icon } from '@/shared/mappers/section-item.mapper';
import { SanitizerHtmlPipe } from '@/shared/pipes/sanitizer-html-pipe';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PopoverModule } from 'primeng/popover';
import { SliderModule } from 'primeng/slider';

@Component({
    selector: 'app-picker-icons',
    imports: [FilterByPipe, FormsModule, SanitizerHtmlPipe, InputTextModule, ButtonModule, InputGroupAddonModule, InputGroupModule, SliderModule, ColorPickerModule, PopoverModule],
    templateUrl: './picker-icons.html'
})
export class PickerIcons {
    selectedIcon = input<Icon | null>(null);
    onSelectedIcon = output<Icon>();

    icons = Icons.getAll();

    filterText = linkedSignal<string>(() => (this.selectedIcon() ? this.selectedIcon()!.name : ''));
    size = linkedSignal<number>(() => (this.selectedIcon() ? this.selectedIcon()!.size : 24));
    color = linkedSignal<string>(() => (this.selectedIcon() ? this.selectedIcon()!.color : '#000000'));
    strokeWidth = linkedSignal<number>(() => (this.selectedIcon() ? this.selectedIcon()!.strokeWidth : 2));

    reset() {
        this.size.set(24);
        this.color.set('#000000');
        this.strokeWidth.set(2);
    }

    setSelectedIcon(name: IconName) {
        if (this.selectedIcon() && this.selectedIcon()!.name === name) {
            this.onSelectedIcon.emit(null!);
            return;
        }
        this.onSelectedIcon.emit({
            name,
            size: this.size(),
            color: this.color(),
            strokeWidth: this.strokeWidth()
        });
    }

    private changeProps = effect(() => {
        const icon = this.selectedIcon();
        if (icon && (icon.size !== this.size() || icon.color !== this.color() || icon.strokeWidth !== this.strokeWidth())) {
            this.onSelectedIcon.emit({
                name: icon.name,
                size: this.size(),
                color: this.color(),
                strokeWidth: this.strokeWidth()
            });
        }
    });
}
