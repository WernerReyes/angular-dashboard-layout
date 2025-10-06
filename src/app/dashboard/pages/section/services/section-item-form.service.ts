import { ImageType, SectionItem } from '@/shared/interfaces/section-item';

import { FormUtils } from '@/utils/form-utils';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class SectionItemFormService {
    private readonly fb = inject(FormBuilder);

    form = this.fb.nonNullable.group({
        title: ['', [Validators.required, FormUtils.noWhitespace(), Validators.maxLength(100)]],
        subtitle: ['', [Validators.maxLength(150)]],
        content: ['', [Validators.maxLength(255)]],
        textButton: ['', [Validators.maxLength(50)]],
        imageType: [ImageType.NONE], // null = none, true = local, false = url
        imageFile: [null, [Validators.maxLength(255)]],
        imageUrl: ['', [Validators.maxLength(255)]],
        showLink: [false],
        typeLink: [true], // true = internal, false = external
        linkId: [null],
    });

    constructor() {
        


        this.form.get('showLink')?.valueChanges.subscribe((showLink) => {
            const linkIdControl = this.form.get('linkId');
            const textButtonControl = this.form.get('textButton');
            if (showLink) {
                linkIdControl?.setValidators([Validators.required, FormUtils.noWhitespace()]);
                textButtonControl?.setValidators([Validators.required, FormUtils.noWhitespace()]);
            } else {
                linkIdControl?.clearValidators();
                textButtonControl?.clearValidators();
            }

            linkIdControl?.updateValueAndValidity();
            textButtonControl?.updateValueAndValidity();
        });
    }

    populateForm(section: SectionItem) {
        this.form.setValue({
           
            title: section.title!,
            subtitle: section.subtitle!,
            content: section.description!,
            showLink: !!section.linkId,
            textButton: section.textButton!,
            typeLink: !!section.linkId,
            linkId: section.linkId as any,
            imageFile: null,
            imageUrl: section.image || '',
            imageType: (section.image ? true : section.image ? false : null) as any // TODO: Check this
            
        });
    }

    reset() {
        this.form.reset();
    }
}
