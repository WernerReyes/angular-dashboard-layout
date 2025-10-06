interface GetAllPagesFilter {
    freePagesOnly?: boolean;
}

export interface CreatePage {
    readonly title: string;
    readonly slug: string;
    readonly description: string;
}