import { MachineService } from '@/dashboard/services/machine.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { type FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'machine-form',
  imports: [ErrorBoundary,  MultiSelectModule, CommonModule, ReactiveFormsModule],
  templateUrl: './machine-form.html',
})
export class MachineForm {
 private readonly machineService = inject(MachineService);

 machinesList = this.machineService.machinesListRs;
 
  form = input.required<FormGroup>();


 
}
