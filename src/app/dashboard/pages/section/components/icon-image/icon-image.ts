import { ImageError } from '@/shared/components/error/image/image';
import { Icons } from '@/shared/constants/icons';
import { type Icon, IconType } from '@/shared/mappers/section-item.mapper';
import { SanitizerHtmlPipe } from '@/shared/pipes/sanitizer-html-pipe';
import { Component, input } from '@angular/core';
import { JsonPipe } from '@angular/common';

type IconImageFields = {
    iconType: IconType | null;
    iconUrl: string | null;
    icon: Icon | null;
    title: string | null;
};
@Component({
    selector: 'icon-image',
    imports: [ImageError, SanitizerHtmlPipe],
    templateUrl: './icon-image.html'
})
export class IconImage<T extends IconImageFields> {
    item = input.required<T>();

    imageClass = input<string>();
    imageErrorClass = input<{
        iconClass?: string;
        containerClass?: string;
    }>();

    IconType = IconType;

    Icons = Icons;
}
