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
        file: [null as File | null],
        currentFileUrl: [null as string | null],
        url: [null],
        openInNewTab: [false, [Validators.required]]
    });

    constructor() {
        this.form.get('type')?.valueChanges.subscribe((type) => {
            if (type === LinkType.PAGE) {
                this.form.get('pageId')?.setValidators([Validators.required, Validators.min(1)]);
                // this.form.get('url')?.clearValidators();
                // this.form.get('file')?.clearValidators();
                this.clearValidator(['url', 'file']);
                // this.form.get('url')?.setValue(null);
            } else if (type === LinkType.EXTERNAL) {
                this.form.get('url')?.setValidators([Validators.required, Validators.pattern(PatternsConst.URL)]);
                // this.form.get('pageId')?.clearValidators();
                // this.form.get('file')?.clearValidators();
                this.clearValidator(['pageId', 'file']);
                // this.form.get('pageId')?.setValue(null);
            } else if (type === LinkType.FILE) {
                this.form.get('file')?.setValidators([Validators.required]);
                this.form.get('file')?.updateValueAndValidity();

                this.clearValidator(['pageId', 'url']);
                // this.form.get('pageId')?.setValue(null);
            }
        });

        this.form.get('currentFileUrl')?.valueChanges.subscribe((currentFileUrl) => {
            if (currentFileUrl) {
                this.clearValidator(['file']);
            }
        });
    }

    private clearValidator(controls: string[]) {
        controls.forEach((control) => {
            this.form.get(control)?.clearValidators();
            this.form.get(control)?.updateValueAndValidity();
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
        // else if (link.type === LinkType.FILE) {
        //     if (link.fileUrl) {
        //         this.clearValidator(['file']);
        //     } else {
        //         this.form.get('file')?.setValidators([Validators.required]);
        //         this.form.get('file')?.updateValueAndValidity();
        //         // this.form.get('url')?.clearValidators();
        //         this.clearValidator(['url']);
        //     }
        //     // this.form.get('file')?.setValidators([Validators.required]);
        //     // this.form.get('pageId')?.clearValidators();
        // }
        this.form.patchValue({
            title: link.title,
            type: link.type,
            pageId: link.pageId as any,
            url: link.url as any,
            openInNewTab: link.openInNewTab,
            currentFileUrl: link.fileUrl
        });
    }

    clearTemporalValidators() {
        this.form.get('pageId')?.clearValidators();
        this.form.get('url')?.clearValidators();
        this.form.get('file')?.clearValidators();
    }

    reset() {
        this.form.reset();
    }
}
