import { ImageError } from '@/shared/components/error/image/image';
import type { SectionItem } from '@/shared/interfaces/section-item';
import { IconType } from '@/shared/mappers/section-item.mapper';
import { SanitizerHtmlPipe } from '@/shared/pipes/sanitizer-html-pipe';
import { Component, input } from '@angular/core';
import { Icons } from '@/shared/constants/icons';

@Component({
    selector: 'icon-image',
    imports: [ImageError, SanitizerHtmlPipe],
    templateUrl: './icon-image.html'
})
export class IconImage {
    item = input.required<SectionItem>();

    imageClass = input();
    imageErrorClass = input<{
        iconClass?: string;
        containerClass?: string;
    }>();

    IconType = IconType;

    Icons = Icons;
}
