import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'sanitizerHtml'
})
export class SanitizerHtmlPipe implements PipeTransform {
    private readonly sanitizer = inject(DomSanitizer);

    transform<T>(values: T[] | T, key?: keyof T): T[] {
        if (!key) {
            if (Array.isArray(values)) {
                return values.map((item) => this.sanitizer.bypassSecurityTrustHtml(item as unknown as string)) as T[];
            }
            return [this.sanitizer.bypassSecurityTrustHtml(values as unknown as string) as T];
        }

        if (Array.isArray(values)) {
            return values.map((item) => {
                return {
                    ...item,
                    [key]: this.sanitizer.bypassSecurityTrustHtml(item[key] as string)
                };
            }) as T[];
        }
        return [
            {
                ...values,
                [key]: this.sanitizer.bypassSecurityTrustHtml(values[key] as string)
            } as T
        ];
    }
}
