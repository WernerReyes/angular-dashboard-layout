import { ImageType, SectionItem } from '@/shared/interfaces/section-item';
import { InputType } from '@/shared/mappers/section-item.mapper';
import { SectionType } from '@/shared/mappers/section.mapper';

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
        content: ['', [Validators.minLength(10), Validators.maxLength(255)]],
        textButton: ['', [Validators.maxLength(50)]],

        imageType: [ImageType.NONE], // null = none, true = local, false = url
        currentImage: [''],
        imageFile: [null, [Validators.maxLength(255)]],
        imageUrl: ['', [Validators.maxLength(255)]],

        imageBackType: [ImageType.NONE], // null = none, true = local, false = url
        currentImageBack: [''],
        imageBackFile: [null, [Validators.maxLength(255)]],
        imageBackUrl: ['', [Validators.maxLength(255)]],

        iconFile: ['', [Validators.maxLength(100)]],
        currentIconUrl: [''],

        categoryId: [null],

        showLink: [false],
        typeLink: [true], // true = internal, false = external
        linkId: [null],

        inputType: [null as InputType | null]
    });

    constructor() {
        this.form.get('showLink')?.valueChanges.subscribe((showLink) => {
            const linkIdControl = this.form.get('linkId');
            const textButtonControl = this.form.get('textButton');
            if (showLink) {
                linkIdControl?.setValidators([Validators.required, FormUtils.noWhitespace()]);
                textButtonControl?.setValidators([Validators.required, FormUtils.noWhitespace()]);
            } else {
                // linkIdControl?.setValue(null);
                // textButtonControl?.setValue('');
                linkIdControl?.clearValidators();
                textButtonControl?.clearValidators();
            }

            linkIdControl?.updateValueAndValidity();
            textButtonControl?.updateValueAndValidity();
        });
    }

    setSectionType(type: SectionType) {
        switch (type) {
            case SectionType.HERO:
                this.disableFields(['iconFile', 'currentIconUrl', 'inputType']);
                // this.disableFields(['icon']);
                break;

            case SectionType.WHY_US:
                this.disableFields(['imageFile', 'currentImage', 'imageBackFile', 'currentImageBack', 'subtitle', 'textButton', 'showLink', 'linkId', 'typeLink', 'categoryId', 'inputType']);
                break;

            case SectionType.CASH_PROCESSING_EQUIPMENT:
                this.disableFields(['subtitle', 'content', 'imageFile', 'currentImage', 'imageBackFile', 'currentImageBack', 'categoryId', 'inputType']);
                break;

            case SectionType.VALUE_PROPOSITION:
                this.disableFields(['imageFile', 'currentImage', 'imageBackFile', 'currentImageBack', 'textButton', 'showLink', 'linkId', 'typeLink', 'iconFile', 'currentIconUrl', 'categoryId', 'inputType']);
                break;

            case SectionType.CLIENT:
                const image = this.form.get('imageFile');
                image?.setValidators([Validators.required]);
                image?.updateValueAndValidity();
                this.disableFields(['title', 'subtitle', 'content', 'imageBackFile', 'currentImageBack', 'imageBackUrl', 'imageBackType', 'textButton', 'showLink', 'linkId', 'typeLink', 'iconFile', 'currentIconUrl', 'categoryId', 'inputType']);
                break;

            case SectionType.OUR_COMPANY:
                this.disableFields(['imageFile', 'currentImage', 'imageBackFile', 'currentImageBack', 'textButton', 'showLink', 'linkId', 'typeLink', 'iconFile', 'currentIconUrl', 'categoryId', 'inputType']);
                break;

            case SectionType.MACHINE:
                const sectionId = this.form.get('categoryId');
                sectionId?.setValidators([Validators.required]);
                sectionId?.updateValueAndValidity();
                this.disableFields(['subtitle', 'imageBackFile', 'currentImageBack', 'iconFile', 'currentIconUrl', 'inputType']);
                break;

            case SectionType.CONTACT_TOP_BAR:
                this.disableFields(['subtitle', 'content', 'imageFile', 'currentImage', 'imageBackFile', 'currentImageBack', 'textButton', 'showLink', 'linkId', 'typeLink', 'categoryId', 'inputType']);
                break;
                
            case SectionType.CONTACT:
                const inputType = this.form.get('inputType');
                inputType?.setValidators([Validators.required]);
                inputType?.updateValueAndValidity();
                // this.disableFields(['subtitle', 'content', 'imageFile', 'currentImage', 'imageBackFile', 'currentImageBack', 'textButton', 'showLink', 'linkId', 'typeLink', 'categoryId']);
                break;
        }
    }

    private disableFields(fields: string[]) {
        Object.keys(this.form.controls).forEach((key) => {
            const control = this.form.get(key);
            if (fields.includes(key)) {
                control?.disable();
            } else {
                control?.enable();
            }
        });
    }

    populateForm(section: SectionItem) {
        this.form.markAsPristine();
        this.form.markAsUntouched();
        // TODO: CHECK console.log(section);
        this.form.setValue({
            title: section.title!,
            subtitle: section.subtitle!,
            content: section.description!,
            showLink: !!section.linkId,
            textButton: section.textButton!,
            typeLink: !!section.linkId,
            linkId: section.linkId ?? (null as any),

            categoryId: section.categoryId ?? (null as any),

            imageFile: null,
            currentImage: section.image || '',
            imageUrl: '',
            imageType: ImageType.NONE,

            iconFile: '',
            currentIconUrl: section.icon || '',

            imageBackFile: null,
            currentImageBack: section.backgroundImage || '',
            imageBackUrl: '',
            imageBackType: ImageType.NONE,

            inputType: section.inputType || null
        });
    }

    reset() {
        this.form.reset();
    }
}
