import { Link } from '@/shared/interfaces/link';
import { LinkType } from '@/shared/mappers/link.mapper';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterLinksByType'
})
export class FilterLinksByTypePipe implements PipeTransform {
    transform(value: Link[], type: LinkType): Link[] {
        if (!value) return value;
        return value.filter((link) => link.type === type);
    }
}
