import { SectionType } from '@/shared/mappers/section.mapper';

export interface CreateSection {
    type: SectionType;
    title: string;
    active: boolean;
    subtitle: string | null;
    description: string | null;
    textButton: string | null;
    linkId: number | null;
    pageId: number;
    fileImage?: File | null;
    imageUrl?: string | null;

}
