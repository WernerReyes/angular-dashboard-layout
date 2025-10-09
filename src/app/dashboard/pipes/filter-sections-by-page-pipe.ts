import { Section } from '@/shared/interfaces/section';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterSectionsByPage'
})
export class FilterSectionsByPagePipe implements PipeTransform {
    transform(value: Section[], pageId: number): Section[] {
        if (!value) return [];
        return value.filter((section) => section.pageId === pageId);
    }
}
