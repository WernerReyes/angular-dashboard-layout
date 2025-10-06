import { PatternsConst } from '@/shared/constants/patterns';
import { Page } from '@/shared/interfaces/page';
import { FormUtils } from '@/utils/form-utils';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class PageFormService {
    private readonly fb = inject(FormBuilder);

    form = this.fb.nonNullable.group({
        title: ['', [Validators.required, FormUtils.noWhitespace(), Validators.minLength(3), Validators.maxLength(100)]],
        slug: ['', [Validators.required, FormUtils.noWhitespace(), Validators.pattern(PatternsConst.SLUG)]],
        content: ['']
    });

    constructor() {
        this.form.get('title')?.valueChanges.subscribe((title) => {
            const slug = title.toLowerCase().replace(/\s+/g, '-');
            this.form.get('slug')?.setValue(slug);
        });

        this.form.get('content')?.valueChanges.subscribe((content) => {
            if (content.length > 1) {
                this.form.get('content')?.setValidators([FormUtils.noWhitespace(), Validators.minLength(10)]);
            } else {
                this.form.get('content')?.clearValidators();
            }
        });
    }

    populateForm(page: Page) {
        this.form.patchValue({
            title: page.title,
            slug: page.slug,
            content: page.description || undefined
        });
    }

    reset() {
        this.form.reset();
    }
}
