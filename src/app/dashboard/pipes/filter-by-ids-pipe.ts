import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterByIds'
})
export class FilterByIdsPipe implements PipeTransform {
    transform(array: { [key: string]: any }[], ids: null | number[] | number, field: string): any[] {
        console.log({ array, ids, field });
        if (!ids || (ids instanceof Array && ids.length === 0)) return array;
        if (typeof ids === 'number') ids = [ids];
        return array.filter((item) => ids.includes(item[field]));
    }
}
