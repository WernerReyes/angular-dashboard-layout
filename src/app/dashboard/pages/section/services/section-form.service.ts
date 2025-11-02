import { Menu } from '@/shared/interfaces/menu';
import { Section } from '@/shared/interfaces/section';
import { ImageType } from '@/shared/interfaces/section-item';
import { LinkType } from '@/shared/mappers/link.mapper';
import { SectionType } from '@/shared/mappers/section.mapper';
import { FormUtils } from '@/utils/form-utils';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import type { TreeNode } from 'primeng/api';

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
        active: [true, [Validators.required]],

        machinesIds: [[] as number[]],
        menusIds: [[] as TreeNode[]]
    });

    constructor() {
        this.form.get('type')?.valueChanges.subscribe((type) => {
            const menusIdsControl = this.form.get('menusIds');
            const imageFile = this.form.get('imageFile')
            if (type === SectionType.MAIN_NAVIGATION_MENU || type === SectionType.FOOTER) {
                menusIdsControl?.setValidators([Validators.required]);

                console.log(this.form.get('currentImage')?.value)
                if (!this.form.get('currentImage')?.value) {


                    // imageFile?.setValidators([Validators.required]);
                }

            } else {
                menusIdsControl?.clearValidators();
                imageFile?.clearValidators();
            }
            imageFile?.updateValueAndValidity();
            menusIdsControl?.updateValueAndValidity();
        });

        this.form.get('showLink')?.valueChanges.subscribe((showLink) => {
            const linkIdControl = this.form.get('linkId');
            const textButtonControl = this.form.get('textButton');
            const type = this.form.get('type');
            if (showLink) {
                textButtonControl?.setValidators([Validators.required, FormUtils.noWhitespace()]);
                if (type?.value === SectionType.CONTACT_US) {
                    return;
                }

                linkIdControl?.setValidators([Validators.required, FormUtils.noWhitespace()]);
            } else {
                linkIdControl?.clearValidators();
                // linkIdControl?.setValue(null);
                // textButtonControl?.setValue('');
                textButtonControl?.clearValidators();
            }

            linkIdControl?.updateValueAndValidity();
            textButtonControl?.updateValueAndValidity();
        });

        // this.form.get('currentImage')?.valueChanges.subscribe((currentImage) => {
        //     const imageFile = this.form.get('imageFile');
        //     if (!currentImage) {
        //         imageFile?.setValidators([Validators.required]);
        //     } else {
        //         imageFile?.clearValidators();
        //     }
        //     imageFile?.updateValueAndValidity();
        // });

        this.form.get('menusIds')?.valueChanges.subscribe((menus) => {
            const menusIdsControl = this.form.get('menusIds');
            const menusWithoutChildren = (menus as TreeNode[]).filter((menu) => !menu.children || menu.children.length === 0);
            menusIdsControl?.setValue(menusWithoutChildren, { emitEvent: false });
        });

        this.form.get('machinesIds')?.valueChanges.subscribe((machines) => {
            const machinesIdsControl = this.form.get('machinesIds');
            if (!Array.isArray(machines)) {
                machinesIdsControl?.setValue([machines], { emitEvent: false });
            }
        });
    }

    populateForm(section: Section, pageId: number) {
        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.form.get('type')?.disable();

        this.form.setValue({
            type: section.type,
            title: section.title!,
            subtitle: section.subtitle!,
            content: section.description!,
            showLink: section.type === SectionType.CONTACT_US ? !!section.textButton : !!section.linkId,
            textButton: section.textButton!,
            typeLink: section.link ? (section.link.type === LinkType.PAGE ? true : false) : true,
            linkId: section.linkId as any,
            active: section.pivotPages ? section.pivotPages.find((pp) => pp.idPage=== pageId)?.active ?? true : true,
            
            imageFile: null,
            currentImage: section.image || '',
            imageUrl: '',
            imageType: ImageType.NONE,

            machinesIds: this.setMachinesIds(section),

            menusIds: section.menus ? section.menus.map((menu) => this.buildRecursiveNode(menu)) : []
        });
    }

    private setMachinesIds(section: Section): any {
        if (section.type === SectionType.MACHINE_DETAILS) {
            return section.machines?.[0]?.id ? section.machines[0].id : null;
        }
        return section.machines ? section.machines.map((machine) => machine.id) : [];
    }

 private buildRecursiveNode(menu: Menu): TreeNode {
    const node: TreeNode = {
        key: menu.id.toString(),
        label: menu.title,
        data: menu.id
    };

    if (menu.parent) {
        node.parent = this.buildRecursiveNode(menu.parent); // llamada recursiva
    }

    return node;
}

    
    

    reset() {
        this.form.reset();
    }
}
