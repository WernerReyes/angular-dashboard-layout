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
            const slug = this.slugify(title);
            this.form.get('slug')?.setValue(slug, { emitEvent: false });
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

    // helper para generar slugs seguros (quita tildes, caracteres inválidos, colapsa guiones)
    private slugify(value: string): string {
        if (!value) return '';
        return value
            .toLowerCase() // convertir a minúsculas
            .trim() // eliminar espacios al inicio y fin
            .normalize('NFD') // descomponer caracteres acentuados
            .replace(/[\u0300-\u036f]/g, '') // eliminar acentos (é → e)
            .replace(/[^a-z0-9\s-]/g, '') // quitar caracteres especiales excepto espacios y guiones
            .replace(/\s+/g, '-') // reemplazar espacios por guiones
            .replace(/-+/g, '-'); // evitar guiones consecutivos
    }

    reset() {
        this.form.reset();
    }
}
