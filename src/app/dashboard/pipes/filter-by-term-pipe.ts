import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterByTerm'
})
export class FilterByTermPipe implements PipeTransform {
    transform<T>(array: T[], field: keyof T, term: string): any[] {
        if (!term) return array;

        const lowerTerm = term.toLowerCase();
        return array.filter((item) => {
            const fieldValue = item[field];
            if (typeof fieldValue === 'string') {
                return fieldValue.toLowerCase().includes(lowerTerm);
            }
            return false;
        });
    }
}
