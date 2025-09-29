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
    readonly type: MenuTypes;
    readonly pageId: number | null;
    readonly url: string | null;
    readonly parentId: number | null;
}