import { computed, inject, Injectable, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MenuType, MenuTypes } from '../interfaces/menu';
import { PatternsConst } from '@/shared/constants/patterns';

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

    dropdownType = computed<MenuType[]>(() => this.menusType().filter((menu) => menu.code !== MenuTypes.DROPDOWN));

    form = this.fb.nonNullable.group({
        title: ['', [Validators.required, Validators.minLength(3)]],
        menuType: [
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
        dropdownItems: this.fb.array<FormGroup<any>>([])
    });

    selectedMenuType = signal<MenuType | undefined>(undefined);

    private createDropdownGroup(order: number = this.dropdownItems.length + 1) {
        const group = this.fb.nonNullable.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            order: [order, [Validators.required, Validators.min(1)]],
            active: [true, [Validators.required]],
            menuType: ['' as MenuTypes, [Validators.required]],
            pageId: [null],
            menuId: [0],
            url: [null]
        });

        // Aplico validaciones iniciales según el tipo
        // this.applyTypeValidators(group, menuType);

        // Me suscribo a cambios de menuType para actualizar validaciones dinámicamente
        group.get('menuType')?.valueChanges.subscribe((type: MenuTypes | '') => {
            this.applyTypeValidators(group, type);
        });

        group.get('pageId')?.valueChanges.subscribe(() => {
            this.dropdownItems.updateValueAndValidity();
        });

        return group;
    }

    constructor() {
        this.ngOnInit();
    }

    ngOnInit() {
        this.form.get('title')?.valueChanges.subscribe((titleValue) => {
            this.handleTitleChange(titleValue);

            // if (this.isValidTitle(titleValue) === false) {
            //     // this.selectedMenuType.set(undefined);
            // }
        });

        this.form.get('menuType')?.valueChanges.subscribe((typeValue) => {
            const selectedType = this.menusType().find((menu) => menu.code === typeValue);
            if (selectedType) {
                this.selectedMenuType.set(selectedType);
                // this.setValidatorsForForm();
                this.applyTypeValidators(this.form, selectedType.code);
            }
        });
    }

    private handleTitleChange(titleValue: string) {
        const typeControl = this.form.get('menuType');

        if (this.isValidTitle(titleValue)) {
        // Solo habilitar el control sin triggear cambios
        if (typeControl?.disabled) {
            typeControl.enable({ emitEvent: false }); // 👈 No emitir eventos
        }
    } else {
        typeControl?.disable({ emitEvent: false }); // 👈 No emitir eventos
        //TODO // this.selectedMenuType.set(undefined);
    }
    }

    private isValidTitle(title: string): boolean {
        const titleControl = this.form.get('title');
        return !!(title && title.trim().length > 0 && titleControl?.valid);
    }

    private applyTypeValidators(group: FormGroup, menuType: MenuTypes | '') {
        if (!menuType) return;
        // Resetea validadores primero
        ['pageId', 'url', 'dropdownItems'].forEach((controlName) => {
            group.get(controlName)?.clearValidators();
            group.get(controlName)?.updateValueAndValidity();
        });

        const resetValues: any = {
            pageId: null,
            url: null
        };

        // if (group.get('dropdownItems')) {
        //     this.dropdownItems.clear();
        // }

        switch (menuType) {
            case MenuTypes.INTERNAL_PAGE:
                group.get('pageId')?.setValidators([Validators.required]);
                delete resetValues.pageId;
                break;

            case MenuTypes.EXTERNAL_LINK:
                group.get('url')?.setValidators([Validators.required, Validators.pattern(PatternsConst.URL)]);
                delete resetValues.url;

                break;

            case MenuTypes.DROPDOWN:
                if (this.dropdownItems.length === 0) {
                    // this.addDropdown();
                    this.form.setControl('dropdownItems', this.fb.array<FormGroup<any>>([this.createDropdownGroup()]));
                }
                this.form.controls['dropdownItems'].setValidators([this.minLengthArray(1), this.uniquePageIdValidator]);

                // this.dropdownItems.

                break;
        }
    }

    get dropdownItems() {
        return this.form.get('dropdownItems') as FormArray<FormGroup>;
    }

    addDropdown(order: number = this.dropdownItems.length + 1) {
        
        this.dropdownItems.push(this.createDropdownGroup(order));
        


        this.dropdownItems.updateValueAndValidity();
    }
    removeDropdown(index: number) {
        this.dropdownItems.removeAt(index);

        this.updateDropdownOrder();

        // Forzar actualización del FormArray
        this.dropdownItems.updateValueAndValidity();
    }

     private updateDropdownOrder() {
        this.dropdownItems.controls.forEach((control, index) => {
            control.get('order')?.setValue(index + 1);
        });
    }

    minLengthArray(min: number) {
        return (control: AbstractControl) => {
            if (control instanceof FormArray) {
                return control.length >= min ? null : { minLengthArray: true };
            }
            return null;
        };
    }

    private uniquePageIdValidator = (control: AbstractControl): ValidationErrors | null => {
        if (!(control instanceof FormArray)) return null;

        const pageIds: (string | number)[] = [];
        const duplicates: number[] = [];

        control.controls.forEach((group, index) => {
            if (group instanceof FormGroup) {
                const pageIdControl = group.get('pageId');
                const menuTypeControl = group.get('menuType');

                // Solo validar si es tipo internal-page y tiene pageId
                if (menuTypeControl?.value === MenuTypes.INTERNAL_PAGE && pageIdControl?.value) {
                    const pageId = pageIdControl.value;

                    if (pageIds.includes(pageId)) {
                        duplicates.push(index);
                        // Marcar error en el control específico
                        pageIdControl.setErrors({ duplicate: true });
                    } else {
                        pageIds.push(pageId);
                        // Limpiar error de duplicado si existía
                        const currentErrors = pageIdControl.errors;
                        if (currentErrors?.['duplicate']) {
                            delete currentErrors['duplicate'];
                            const hasOtherErrors = Object.keys(currentErrors).length > 0;
                            pageIdControl.setErrors(hasOtherErrors ? currentErrors : null);
                        }
                    }
                }
            }
        });

        return duplicates.length > 0 ? { duplicate: { indices: duplicates } } : null;
    };
}
