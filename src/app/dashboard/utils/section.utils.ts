import type { Section } from '@/shared/interfaces/section';
import type { SectionItem } from '@/shared/interfaces/section-item';

export class SectionUtils {
    static insertSectionItemInSectionList(sectionList: Section[], sectionItem: SectionItem): Section[] {
        return sectionList.map((section) => {
            if (section.id === sectionItem.sectionId) {
                return {
                    ...section,
                    items: [...section.items, sectionItem]
                };
            }
            return section;
        });
    }

    static updateSectionItemInSectionList(sectionList: Section[], sectionItem: SectionItem): Section[] {
        console.log('Updating section item in section list:', sectionItem);
        return sectionList.map((section) => {
            if (section.id === sectionItem.sectionId) {
                const updatedItems = section.items.map((item) => (item.id === sectionItem.id ? { ...sectionItem } : { ...item }));
                return { ...section, items: updatedItems };
            }
            return { ...section };
        });
    }

    static removeSectionItemFromSectionList(sectionList: Section[], sectionItemId: number, sectionId: number): Section[] {
        return sectionList.map((section) => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    items: section.items.filter((item) => item.id !== sectionItemId)
                };
            }
            return section;
        });
    }
}
