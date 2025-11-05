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
       
    });

    
    
    populateForm(menu: Menu) {
        if (menu.children && menu.children.length > 0) {
            this.form.get('linkId')?.clearValidators();
        }
        
        this.form.patchValue({
            title: menu.title,
            linkId: menu.linkId as any,
            parentId: menu.parentId ? { key: menu.parent?.id.toString(), label: menu.parent?.title, data: menu.parent?.id } as TreeNode : null,
            linkType: menu.link?.type,
           
        });
    }


    

    reset() {
        this.form.reset();
    }
}
