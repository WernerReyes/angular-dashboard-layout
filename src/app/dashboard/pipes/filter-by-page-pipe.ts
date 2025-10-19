import { PivotPages, Section } from '@/shared/interfaces/section';
import { SectionMode } from '@/shared/mappers/section.mapper';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterByPage'
})
export class FilterByPagePipe implements PipeTransform {
  transform(
    sections: Section[],
    searchObj: Partial<Record<keyof PivotPages, any>>,
    keys: (keyof PivotPages)[]
  ): Section[] {
    if (!sections || !keys || keys.length === 0) return sections;

    return sections.filter((section) => {
        const type = keys.includes('type') ? searchObj['type'] : null;

        if (type === SectionMode.LAYOUT) {
          return !section.pivotPages || section.pivotPages.length === 0;
        }

      return keys.every((key) => {
        const value = searchObj[key];
        return (
          section.pivotPages &&
          section.pivotPages.some((pivot) => pivot[key] === value)
        );
      });
    });
  }
}