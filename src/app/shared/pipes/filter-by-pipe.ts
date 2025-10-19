import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {
    transform<T>(items: T[], key: keyof T, value: any): T[] {
        if (!items || !key || value === undefined || value === null) return items;
        return items.filter((item) => item[key] === value);
    }
}
