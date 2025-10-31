import { FilterByIdsPipe } from '@/dashboard/pipes/filter-by-ids-pipe';
import { MachineService } from '@/dashboard/services/machine.service';
import { ImageError } from '@/shared/components/error/image/image';
import { Machine } from '@/shared/interfaces/machine';
import type { Section } from '@/shared/interfaces/section';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { SplitterModule } from 'primeng/splitter';
import type { ContextMenuCrud } from '../../components/context-menu-crud/context-menu-crud';
@Component({
    selector: 'section-machine-items',
    imports: [ImageError, FilterByIdsPipe, SplitterModule, FormsModule, ListboxModule, CardModule, ButtonModule, MenuModule],
    templateUrl: './section-machine-items.html'
})
export class SectionMachineItems {
    private readonly machineService = inject(MachineService);
    private readonly breakpointObserver = inject(BreakpointObserver);

    machinesList = this.machineService.machinesListRs;

    section = input.required<Section>();
    
    
    selectedCategoryId = signal<number | null>(null);

    categories = computed(() => {
        const uniqueCategories = this.section()
            ?.machines?.map((machine) => machine.category)
            .filter((category, index, self) => category != null && index === self.findIndex((c) => c?.id === category.id));

        return uniqueCategories || [];
    });

    isMobile = signal<boolean>(false);

    constructor() {
        this.breakpointObserver
            .observe(['(max-width: 768px)']) // también puedes usar '(max-width: 768px)'
            .subscribe((result) => {
                this.isMobile.set(result.matches);
            });
    }
}
