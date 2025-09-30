export interface FormModel {
    title: string;
    menuType: {
        value: string;
        disabled: boolean;
    };
    order: number;
    active: boolean;
    pageId: number | null;
    url: string | null;
    dropdownItems: any[]; // Replace 'any' with a more specific type if available
}
