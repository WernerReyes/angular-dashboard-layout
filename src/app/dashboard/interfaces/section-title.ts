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
    // categoryId: number | null;
}



// public $sectionType;

//     public $sectionId;

//     public $title;

//     public $subtitle;

//     public $content;

//     public $fileImage;

//     public $imageUrl;

//     public $linkId;

//     public $linkTexted;