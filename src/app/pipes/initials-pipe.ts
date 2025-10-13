import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'initials'
})
export class InitialsPipe implements PipeTransform {
    transform(fullString: string): string {
        if (!fullString) return '';
        const names = fullString.trim().split(/\s+/);
        const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
        return initials;
    }
}
