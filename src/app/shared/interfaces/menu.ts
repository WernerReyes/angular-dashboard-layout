
export interface Menu {
    readonly id: number;
    readonly title: string;
    readonly url: string | null;
    readonly slug: string;
    readonly order: number;
    readonly active: boolean;
    readonly parentId: number | null;
    readonly userId: number;
}
