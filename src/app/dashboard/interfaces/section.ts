import { SectionMode, SectionType } from '@/shared/mappers/section.mapper';

export interface CreateSection {
    type: SectionType;
    title: string;
    active: boolean;
    subtitle: string | null;
    description: string | null;
    textButton: string | null;
    linkId: number | null;
    pageId: number | null;
    fileImage?: File | null;
    imageUrl?: string | null;
    menusIds?: number[] | null;
    mode: SectionMode;

}

export interface UpdateSection extends Partial<CreateSection> {
    currentImageUrl: string | null;
}