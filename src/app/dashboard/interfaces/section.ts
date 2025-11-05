import type { AdditionalInfo, Icon, IconType } from '@/shared/mappers/section-item.mapper';
import type { SectionMode, SectionType } from '@/shared/mappers/section.mapper';

export interface CreateSection {
    type: SectionType;
    title: string;
    active: boolean;
    subtitle: string | null;
    description: string | null;
    textButton: string | null;
    extraTextButton: string | null;
    linkId: number | null;
    extraLinkId: number | null;
    pageId: number | null;
    fileImage?: File | null;
    imageUrl?: string | null;
    machinesIds?: number[] | null;
    menusIds?: number[] | null;
    mode: SectionMode;

    fileIcon: File | null;
    fileIconUrl: string | null;
    icon: Icon | null;
    iconType: IconType | null;

    fileVideo?: File | null;

    additionalInfoList: AdditionalInfo[] | null;
}

export interface AssocieteSectionToPages {
    sectionId: number;
    pagesIds: number[];
}

export interface UpdateSection extends Partial<CreateSection> {
    currentImageUrl: string | null;
    currentVideoUrl: string | null;
}
