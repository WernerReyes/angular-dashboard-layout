export interface SectionItem {
    id: number;
    title: string | null;
    subtitle: string | null;
    description: string | null;
    image: string | null;
    backgroundImage: string | null;
    icon: string | null;
    textButton: string | null;
    linkId: number | null;
    order: number;
    sectionId: number;
    categoryId: number | null;
}

export enum ImageType {
    NONE = 'NONE',
    LOCAL = 'LOCAL',
    URL = 'URL'
}

type ImageTypeOption = {
    label: string;
    value: ImageType;
};

export const imageTypeOptions: Record<ImageType, ImageTypeOption> = {
    NONE: { label: 'Ninguna', value: ImageType.NONE },
    LOCAL: { label: 'Subir imagen', value: ImageType.LOCAL },
    URL: { label: 'Usar URL', value: ImageType.URL }
};
