import { Component, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CategoriesList } from './components/categories-list/categories-list';
import { DialogForm } from './components/dialog-form/dialog-form';

@Component({
    selector: 'app-category',
    imports: [DialogForm, CategoriesList, ButtonModule],
    templateUrl: './category.page.html'
})
export default class CategoryPage {
    private readonly fb = new FormBuilder();
    form = this.fb.group({
        id: [null],
        title: ['', [Validators.required, Validators.minLength(3)]],
        oldTitle: ['']
    });

    display = signal<boolean>(false);

    closeDialog() {
        this.display.set(false);
        this.form.reset();
    }
}
