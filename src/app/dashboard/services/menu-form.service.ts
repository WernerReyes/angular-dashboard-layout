import { computed, inject, Injectable, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuType, MenuTypes } from '../interfaces/menu';

@Injectable({
    providedIn: 'root'
})
export class MenuFormService {
    private readonly fb = inject(FormBuilder);

    menusType = computed<MenuType[]>(() => [
        { name: 'Página Interna', code: MenuTypes.INTERNAL_PAGE },
        { name: 'Enlace Externo', code: MenuTypes.EXTERNAL_LINK },
        { name: 'Dropdown', code: MenuTypes.DROPDOWN }
    ]);

    form = this.fb.nonNullable.group({
        title: ['', [Validators.required, Validators.minLength(3)]],
        type: [
            {
                value: '',
                disabled: true
            },
            [Validators.required]
        ],
        order: [1, [Validators.required, Validators.min(1)]],
        active: [true, [Validators.required]],
        pageId: [null],
        url: [null],
        dropdowns: this.fb.array<FormGroup<any>>([])
    });

    selectedMenuType = signal<MenuType | undefined>(undefined);

    private createDropdownGroup() {
        return this.fb.nonNullable.group({
            parentId: [null, [Validators.required]],
            title: ['', [Validators.required, Validators.minLength(3)]],
            order: [1, [Validators.required, Validators.min(1)]],
            active: [true, [Validators.required]]
        });
    }

    constructor() {
        this.ngOnInit();
    }

    ngOnInit() {
        this.form.get('title')?.valueChanges.subscribe((titleValue) => {
            console.log('Title changed:', titleValue);
            this.handleTitleChange(titleValue);

            if (this.isValidTitle(titleValue) === false) {
                // this.onSelectedMenuType.emit(undefined!);
                this.selectedMenuType.set(undefined);
            }
        });

        this.form.get('type')?.valueChanges.subscribe((typeValue) => {
            const selectedType = this.menusType().find((menu) => menu.code === typeValue);
            if (selectedType) {
                this.selectedMenuType.set(selectedType);

                this.setValidatorsForForm();
                // this.onSelectedMenuType.emit(this.selectedMenuType());
            }
        });
    }

    private handleTitleChange(titleValue: string) {
        const typeControl = this.form.get('type');

        if (this.isValidTitle(titleValue)) {
            typeControl?.enable();
        } else {
            typeControl?.disable();
        }
    }

    private isValidTitle(title: string): boolean {
        const titleControl = this.form.get('title');
        return !!(title && title.trim().length > 0 && titleControl?.valid);
    }

    setValidatorsForForm() {
        const type = this.selectedMenuType();

        if (!type) return;

        // Resetea validadores primero
        this.form.controls['pageId'].clearValidators();
        this.form.controls['url'].clearValidators();
        this.form.controls['dropdowns'].clearValidators();

        switch (type.code) {
            case MenuTypes.INTERNAL_PAGE:
                this.form.controls['pageId'].setValidators([Validators.required]);
                break;

            case MenuTypes.EXTERNAL_LINK:
                this.form.controls['url'].setValidators([Validators.required, Validators.pattern(/^https?:\/\//)]);
                break;

            case MenuTypes.DROPDOWN:
                this.form.setControl('dropdowns', this.fb.array<FormGroup<any>>([this.createDropdownGroup()]));
                this.form.controls['dropdowns'].setValidators([this.minLengthArray(1)]);
                break;
        }

        // 👈 Importante: actualizar validadores
        this.form.controls['pageId'].updateValueAndValidity();
        this.form.controls['url'].updateValueAndValidity();
        this.form.controls['dropdowns'].updateValueAndValidity();
    }

    get dropdowns() {
        return this.form.get('dropdowns') as FormArray;
    }

    addDropdown() {
        this.dropdowns.push(this.createDropdownGroup());
    }
    removeDropdown(index: number) {
        this.dropdowns.removeAt(index);
    }

    minLengthArray(min: number) {
        return (control: AbstractControl) => {
            if (control instanceof FormArray) {
                return control.length >= min ? null : { minLengthArray: true };
            }
            return null;
        };
    }
}
