import type { Menu } from '@/shared/interfaces/menu';
import { Section } from '@/shared/interfaces/section';
import { ImageType } from '@/shared/interfaces/section-item';
import { LinkType } from '@/shared/mappers/link.mapper';
import { SectionType } from '@/shared/mappers/section.mapper';
import { FormUtils } from '@/utils/form-utils';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class SectionFormService {
    private readonly fb = inject(FormBuilder);

    form = this.fb.nonNullable.group({
        type: [SectionType.HERO, [Validators.required]],
        title: ['', [Validators.required, FormUtils.noWhitespace(), Validators.maxLength(200)]],
        subtitle: ['', [Validators.maxLength(150)]],
        content: [''],
        textButton: ['', [Validators.maxLength(50)]],

         imageType: [ImageType.NONE], // null = none, true = local, false = url
                currentImage: [''],
                imageFile: [null, [Validators.maxLength(255)]],
                imageUrl: ['', [Validators.maxLength(255)]],
        
        showLink: [false],
        typeLink: [true], // true = internal, false = external
        linkId: [null],
        active: [true, [Validators.required]]
    });

    constructor() {
        this.form.get('type')?.valueChanges.subscribe((type) => {
            const titleControl = this.form.get('title');
            const subtitleControl = this.form.get('subtitle');
            const contentControl = this.form.get('content');
            if (type === SectionType.HERO) {
                
            }
        });


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

    populateForm(section: Section) {
        this.form.setValue({
            type: section.type,
            title: section.title!,
            subtitle: section.subtitle!,
            content: section.description!,
            showLink: !!section.linkId,
            textButton: section.textButton!,
            typeLink: section.link ? (section.link.type === LinkType.PAGE ? true : false) : true,
            linkId: section.linkId as any,
            active: section.active,

            imageFile: null,
            currentImage: section.image || '',
            imageUrl: '',
            imageType: ImageType.NONE,
        });
    }

    reset() {
        this.form.reset();
    }
}
