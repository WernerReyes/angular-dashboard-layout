import { MachineService } from '@/dashboard/services/machine.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { Component, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OverlayModeType } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'select-machine',
  imports: [ErrorBoundary, ReactiveFormsModule, MultiSelectModule],
  templateUrl: './select-machine.html',
})
export class SelectMachine {
 private readonly machineService = inject(MachineService);

 machinesList = this.machineService.machinesListRs;
 
  form = input.required<FormGroup>();
  label = input.required<string>();
  multiple = input<boolean>(false);
  mode = input<OverlayModeType>('overlay');
}
