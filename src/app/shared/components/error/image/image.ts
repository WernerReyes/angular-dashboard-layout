import { Component, input } from '@angular/core';

@Component({
    selector: 'app-image-error',
    imports: [],
    template: `<div class="w-full h-48 bg-gray-200 dark:bg-gray-800 border border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center text-gray-500" [class]="containerClass()">
        <svg class="w-16 h-16" [class]="iconClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-5 5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    </div>`
})
export class ImageError {
    containerClass = input<string>();
    iconClass = input<string>();
}
