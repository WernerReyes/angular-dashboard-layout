import { CategoryService } from '@/dashboard/services/category.service';
import { Category } from '@/shared/interfaces/category';
import { FormUtils } from '@/utils/form-utils';
import { Component, inject, input, model, output } from '@angular/core';
import { ReactiveFormsModule, type FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'dialog-form',
    imports: [ReactiveFormsModule, DialogModule, MessageModule, InputTextModule, ButtonModule],
    templateUrl: './dialog-form.html'
})
export class DialogForm {
    private readonly categoryService = inject(CategoryService);

    form = input.required<FormGroup<any>>();
    display = input.required<boolean>();
    onCloseDialog = output<void>();

    FormUtils = FormUtils;

    saveChanges() {
        if (this.form().valid) {
            const { id, title: newTitle, oldTitle } = this.form().value;
            if (id) {
                if (newTitle === oldTitle) {
                    return;
                }
                this.categoryService.updateCategory(id, newTitle).subscribe({
                    next: () => {
                        this.onCloseDialog.emit();
                        this.form().reset();
                    }
                });
            } else {
                this.categoryService.createCategory(newTitle).subscribe({
                    next: () => {
                        this.onCloseDialog.emit();
                        this.form().reset();
                    }
                });
            }
        }
    }
}
