import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterArrayBy'
})
export class FilterArrayByPipe implements PipeTransform {
    transform<T>(items: T[], key: keyof T, value: any[]): T[] {
        if (!items || !key || !value || value.length === 0) return items;
        return items.filter((item) => value.includes(item[key]));
    }
}
