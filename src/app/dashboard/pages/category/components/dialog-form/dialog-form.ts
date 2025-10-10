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
    selectedCategory = model<Category | null>();
    display = input.required<boolean>();
    onCloseDialog = output<void>();

    FormUtils = FormUtils;

    saveChanges() {
        if (this.form().valid) {
            const newTitle = this.form().value.title;
            if (this.selectedCategory()) {
                if (newTitle === this.selectedCategory()!.title) {
                    return;
                }
                this.categoryService.updateCategory(this.selectedCategory()!.id, newTitle).subscribe({
                    next: () => {
                        this.onCloseDialog.emit();
                        this.form().reset();
                        this.selectedCategory.set(null);
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
