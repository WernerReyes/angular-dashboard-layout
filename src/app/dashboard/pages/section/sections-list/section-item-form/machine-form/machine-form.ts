import { CategoryService } from '@/dashboard/services/category.service';
import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CommonInputs } from '../../../components/common-inputs/common-inputs';
import { FileUpload } from '../../../components/file-upload/file-upload';
import { ShowLinkSwitch } from '../../../components/show-link-switch/show-link-switch';
import { SectionItemFormService } from '../../../services/section-item-form.service';

@Component({
  selector: 'machine-form',
  imports: [ErrorBoundary, CommonInputs, FileUpload, ShowLinkSwitch, ReactiveFormsModule, SelectModule],
  templateUrl: './machine-form.html',
})
export class MachineForm {
  private readonly categoryService = inject(CategoryService);
  private readonly sectionItemFormService = inject(SectionItemFormService);

  form = this.sectionItemFormService.form

  categoriesList = this.categoryService.categoryListResource;
}
