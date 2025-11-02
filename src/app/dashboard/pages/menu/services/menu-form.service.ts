import type { Menu } from '@/shared/interfaces/menu';
import { LinkType } from '@/shared/mappers/link.mapper';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TreeNode } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class MenuFormService {
    private readonly fb = inject(FormBuilder);

    form = this.fb.nonNullable.group({
        title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        linkId: [null],
        parentId: [null as TreeNode | null],
        linkType: [LinkType.PAGE],
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

    constructor() {
         this.form.get('parentId')?.valueChanges.subscribe((parentId) => {
                    const parentIdControl = this.form.get('parentId');
                    console.log({ parentId });
                    // parentIdControl?.setValue(parentId, { emitEvent: false });
                });
    }

    populateForm(menu: Menu) {
        if (menu.children && menu.children.length > 0) {
            this.form.get('linkId')?.clearValidators();
        }
        
        this.form.patchValue({
            title: menu.title,
            linkId: menu.linkId as any,
            parentId: menu.parentId ? { key: menu.parent?.id.toString(), label: menu.parent?.title, data: menu.parent?.id } as TreeNode : null,
            linkType: menu.link?.type,
            active: menu.active
        });
    }


    //  menusIds: section.menus
    //             ? section.menus.map((menu) => {
    //                   return {
    //                       key: menu.id.toString(),
    //                       label: menu.title,
    //                       data: menu.id,
    //                       parent: menu.parent
    //                           ? {
    //                                 key: menu.parent.id.toString(),
    //                                 label: menu.parent.title,
    //                                 data: menu.parent.id
    //                             }
    //                           : undefined
    //                   };
    //               })
    //             : ([] as TreeNode[])

    reset() {
        this.form.reset();
    }
}
