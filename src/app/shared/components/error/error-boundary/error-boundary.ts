import type { ResourceState } from '@/shared/interfaces/resource';
import { NgTemplateOutlet, } from '@angular/common';
import { Component, ContentChild, input, TemplateRef } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { FallBack } from '../fall-back/fall-back';


@Component({
    selector: 'app-error-boundary',
    imports: [SkeletonModule, FallBack, NgTemplateOutlet ],
    templateUrl: './error-boundary.html',
})
export class ErrorBoundary<T> {
    resource = input.required<ResourceState<T>>();
    errorMessage = input<string>('Ha ocurrido un error inesperado.');
    emptyMessage = input<string>('No hay datos disponibles');
    showEmptyMessage = input<boolean>(true);

    // fallback inputs
    fallbackType = input<'simple' | 'card'>('simple');

    // Skeleton inputs
    skeletonWidth = input<string>('100%');
    skeletonHeight = input<string>('200px')
    skeletonShape = input<'rectangle' | 'circle'>('rectangle');
   

    @ContentChild('loading') loadingTemplate?: TemplateRef<any>;
    @ContentChild('error') errorTemplate?: TemplateRef<any>;
    @ContentChild('empty') emptyTemplate?: TemplateRef<any>;
    @ContentChild('content') contentTemplate?: TemplateRef<any>;
      
}
