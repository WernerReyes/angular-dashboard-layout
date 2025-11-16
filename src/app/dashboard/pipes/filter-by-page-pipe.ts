import { PivotPages, Section } from '@/shared/interfaces/section';
import { SectionMode } from '@/shared/mappers/section.mapper';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterByPage'
})
export class FilterByPagePipe implements PipeTransform {
    transform(sections: Section[], searchObj: Partial<Record<keyof PivotPages, any>>, keys: (keyof PivotPages)[]): Section[] {
        if (!sections || !keys || keys.length === 0) return sections;


        return sections.filter((section) => {
            const type = keys.includes('type') ? searchObj['type'] : null;

            if (type === SectionMode.CUSTOM) {
          
                const pageId = keys.includes('idPage') ? searchObj['idPage'] : null;

                return section.pivotPages && section.pivotPages.some((pivot) => pivot.idPage === pageId);
            }

            if (type === SectionMode.LAYOUT) {
              
                return (
                    !section.pivotPages ||
                    section.pivotPages.length === 0 ||
                    section.pivotPages.some((pivot) => {
                        return pivot.type === type;
                    })
                );
            }

            return keys.every((key) => {
                const value = searchObj[key];
                return section.pivotPages && section.pivotPages.some((pivot) => pivot[key] === value);
            });
        }).sort((a, b) => {
            const pageId = searchObj['idPage'];
            const pivotA = a.pivotPages?.find((pivot) => pivot.idPage === pageId);
            const pivotB = b.pivotPages?.find((pivot) => pivot.idPage === pageId);
            if (pivotA && pivotB) {
                return pivotA.orderNum - pivotB.orderNum;
            }
            return 0;
        });
    }
}
