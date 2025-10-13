import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterByIdsPipe'
})
export class FilterByIdsPipe implements PipeTransform {
    transform(array: { [key: string]: any }[], ids: null | number[] | number, field: string): any[] {
        if (!ids || (ids instanceof Array && ids.length === 0)) return array;
        if (typeof ids === 'number') ids = [ids];
        return array.filter((item) => ids.includes(item[field]));
    }
}
