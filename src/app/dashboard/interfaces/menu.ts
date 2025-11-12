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
    readonly linkId: number;
    readonly parentId: number | null;
    
}




export interface DropdownMenu {
    readonly title: string;
    readonly order: number;
    readonly type: MenuTypes.EXTERNAL_LINK | MenuTypes.INTERNAL_PAGE | '';
    readonly pageId: number | null;
    readonly url: string | null;
}

