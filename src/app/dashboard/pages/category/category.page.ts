import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CategoriesList } from './components/categories-list/categories-list';
import { Category } from '@/shared/interfaces/category';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogForm } from './components/dialog-form/dialog-form';

@Component({
    selector: 'app-category',
    imports: [DialogForm, CategoriesList, ButtonModule],
    templateUrl: './category.page.html'
})
export default class CategoryPage {
    private readonly fb = new FormBuilder();
    form = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3)]]
    });

    selectedCategory = signal<Category | null>(null);
    display = signal<boolean>(false);

    closeDialog() {
        this.display.set(false);
        this.form.reset();
        this.selectedCategory.set(null);
    }
}
