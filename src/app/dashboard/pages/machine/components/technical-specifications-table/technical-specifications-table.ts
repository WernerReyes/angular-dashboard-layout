import { MachineFormService } from '@/dashboard/pages/machine/services/machine-form.service';
import { TecnicalSpecifications } from '@/shared/mappers/machine.mapper';
import { Component, inject, input, model } from '@angular/core';
import type { ContextMenu } from 'primeng/contextmenu';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'technical-specifications-table',
    imports: [TableModule],
    templateUrl: './technical-specifications-table.html'
})
export class TechnicalSpecificationsTable {
    private readonly machineFormService = inject(MachineFormService);

    selectedSpecification = model<TecnicalSpecifications | null>(null);
    cm = input<ContextMenu | null>(null);
    specifications = input.required<TecnicalSpecifications[]>();

    // get specifications() {
    //     return this.machineFormService.machineForm.get('technicalSpecifications')!.value as TecnicalSpecifications[];
    // }
}
