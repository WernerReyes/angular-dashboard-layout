import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluck',
})
export class PluckPipe implements PipeTransform {
  transform(value: any, key?: string, flatten = false): any {
    if (!value) return value;

    // Si es un arreglo
    if (Array.isArray(value)) {
      const mapped = key ? value.map(v => v?.[key]) : value;
      return flatten ? mapped.flat(Infinity) : mapped;
    }

    // Si es un objeto único
    return key ? value[key] : value;
  }
}
