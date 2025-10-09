import { Link } from '@/shared/interfaces/link';
import { LinkType } from '@/shared/mappers/link.mapper';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterLinksByType'
})
export class FilterLinksByTypePipe implements PipeTransform {
    transform(value: Link[], type: boolean): Link[] {
        let linkType = type ? LinkType.PAGE : LinkType.EXTERNAL;
        if (!value) return [];
        return value.filter((link) => link.type === linkType);
    }
}
