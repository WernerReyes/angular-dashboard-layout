import { PatternsConst } from '@/shared/constants/patterns';
import type { Link } from '@/shared/interfaces/link';
import { LinkType } from '@/shared/mappers/link.mapper';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class LinkFormService {
    private readonly fb = inject(FormBuilder);

    form = this.fb.nonNullable.group({
        title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        type: [LinkType.PAGE, [Validators.required]],
        pageId: [null, [Validators.required, Validators.min(1)]],
        url: [null],
        openInNewTab: [false, [Validators.required]]
    });

    constructor() {
        this.form.get('type')?.valueChanges.subscribe((type) => {
            if (type === LinkType.PAGE) {
                this.form.get('pageId')?.setValidators([Validators.required, Validators.min(1)]);
                this.form.get('url')?.clearValidators();
                console.log('pageId validators set');
                // this.form.get('url')?.setValue(null);
            } else if (type === LinkType.EXTERNAL) {
                this.form.get('url')?.setValidators([Validators.required, Validators.pattern(PatternsConst.URL)]);
                this.form.get('pageId')?.clearValidators();
                // this.form.get('pageId')?.setValue(null);
            }
        });
    }

    populateForm(link: Link) {
        if (link.type === LinkType.PAGE) {
            this.form.get('pageId')?.setValidators([Validators.required, Validators.min(1)]);
            this.form.get('url')?.clearValidators();
        } else if (link.type === LinkType.EXTERNAL) {
            this.form.get('url')?.setValidators([Validators.required, Validators.pattern(PatternsConst.URL)]);
            this.form.get('pageId')?.clearValidators();
        }
        this.form.patchValue({
            title: link.title,
            type: link.type,
            pageId: link.pageId as any,
            url: link.url as any,
            openInNewTab: link.openInNewTab
        });
    }

    clearTemporalValidators() {
        this.form.get('pageId')?.clearValidators();
        this.form.get('url')?.clearValidators();
    }

    reset() {
        this.form.reset()
    }
}
