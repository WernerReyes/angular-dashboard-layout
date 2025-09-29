export interface MenuType {
    readonly name: string;
    readonly code: MenuTypes;
}

export enum MenuTypes {
    INTERNAL_PAGE = 'internal-page',
    EXTERNAL_LINK = 'external-link',
    DROPDOWN = 'dropdown'
}

export interface CreateMenu {
    readonly title: string;
    readonly order: number;
    readonly menuType: MenuTypes;
    readonly pageId: number | null;
    readonly url: string | null;
    readonly dropdownArray: DropdownMenu[] | null;
    readonly active: boolean;
}

export interface DropdownMenu {
    readonly title: string;
    readonly order: number;
    readonly active: boolean;
    readonly type: MenuTypes.EXTERNAL_LINK | MenuTypes.INTERNAL_PAGE | '';
    readonly pageId: number | null;
    readonly url: string | null;
}


//  parentId: [null, [Validators.required]],
//             title: ['', [Validators.required, Validators.minLength(3)]],
//             order: [1, [Validators.required, Validators.min(1)]],
//             active: [true, [Validators.required]],
//             menuType: ['', [Validators.required]],
//             pageId: [null],
//             url: [null]