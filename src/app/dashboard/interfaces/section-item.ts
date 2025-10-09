import type { SectionType } from '@/shared/mappers/section.mapper';

export interface CreateSectionItem {
    sectionType: SectionType;
    title: string;
    subtitle: string | null;
    content: string | null;
    fileImage: File | null;
    imageUrl: string | null;
    linkId: number | null;
    linkTexted: string | null;
    sectionId: number;
    backgroundFileImage: File | null;
    backgroundImageUrl: string | null;
    fileIcon: File | null;
    fileIconUrl: string | null;

    // categoryId: number | null;
}

export interface UpdateSectionItem extends Partial<CreateSectionItem> {
    currentImageUrl: string | null;
    currentBackgroundImageUrl: string | null;
}
