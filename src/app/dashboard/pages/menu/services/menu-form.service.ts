import type { Menu } from '@/shared/interfaces/menu';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class MenuFormService {
    private readonly fb = inject(FormBuilder);

    form = this.fb.nonNullable.group({
        title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        linkId: [null, [Validators.required, Validators.min(1)]],
        parentId: [null],
        active: [true, [Validators.required]]
    });

    // constructor() {
    //     this.form.get('type')?.valueChanges.subscribe((type) => {
    //         if (type === LinkType.PAGE) {
    //             this.form.get('pageId')?.setValidators([Validators.required, Validators.min(1)]);
    //             this.form.get('url')?.clearValidators();
    //             // this.form.get('url')?.setValue(null);
    //         } else if (type === LinkType.EXTERNAL) {
    //             this.form.get('url')?.setValidators([Validators.required, Validators.pattern(/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*\/?$/)]);
    //             this.form.get('pageId')?.clearValidators();
    //             // this.form.get('pageId')?.setValue(null);
    //         }
    //     });
    // }

    populateForm(menu: Menu) {
        if (menu.children && menu.children.length > 0) {
            this.form.get('linkId')?.clearValidators();
        }
        
        this.form.patchValue({
            title: menu.title,
            linkId: menu.linkId as any,
            parentId: menu.parentId as any
        });
    }

    reset() {
        this.form.reset();
    }
}
