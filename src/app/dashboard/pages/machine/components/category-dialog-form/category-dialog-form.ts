import type { CreateCategory } from '@/dashboard/interfaces/category';
import { CategoryService } from '@/dashboard/services/category.service';
import { categoryTypesOptions } from '@/shared/interfaces/category';
import { FormUtils } from '@/utils/form-utils';
import { KeyValuePipe } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { MachineFormService } from '../../services/machine-form.service';

@Component({
    selector: 'category-dialog-form',
    imports: [KeyValuePipe, ReactiveFormsModule, DialogModule, ButtonModule, SelectModule, TagModule, MessageModule, InputTextModule],
    templateUrl: './category-dialog-form.html'
})
export class CategoryDialogForm {
    private readonly categoryService = inject(CategoryService);
    private readonly machineFormService = inject(MachineFormService);
    
    form = this.machineFormService.categoryForm;

    display = model.required<boolean>();
   
    categoryOptions = categoryTypesOptions;
    FormUtils = FormUtils;


    closeDialog() { 
        this.display.set(false);
        this.form.reset();
      
    }

    saveChanges() {
        if (this.form.valid) {
            const { id, title: newTitle, type } = this.form.value;
            const payload: CreateCategory = { title: newTitle!, type: type! };
            if (id) {
               
                this.categoryService.updateCategory(id, payload).subscribe({
                    next: () => {
                        // this.onCloseDialog.emit();
                        this.display.set(false);
                        this.form.reset();
                    }
                });
            } else {
                this.categoryService.createCategory(payload).subscribe({
                    next: () => {
                        // this.onCloseDialog.emit();
                        this.display.set(false);
                        this.form.reset();
                    }
                });
            }
        }
    }
}
