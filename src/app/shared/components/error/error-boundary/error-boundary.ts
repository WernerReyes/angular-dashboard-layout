import { Component, ContentChild, input, type TemplateRef } from '@angular/core';

interface ResourceState<T> {
    value(): T | undefined;
    isLoading(): boolean;
    error(): any;
    reload(): void;
}

@Component({
    selector: 'app-error-boundary',
    imports: [],
    templateUrl: './error-boundary.html',
    styleUrl: './error-boundary.scss'
})
export class ErrorBoundary<T> {
    resource = input.required<ResourceState<T>>();
    errorMessage = input<string>('Ha ocurrido un error inesperado.');
    emptyMessage = input<string>('No hay datos disponibles');
    showEmptyMessage = input<boolean>(true);
    // Skeleton inputs
    skeletonWidth = input<string>('100%');
    skeletonHeight = input<string>('200px')
    skeletonShape = input<'rectangle' | 'circle'>('rectangle');
   

    @ContentChild('loading') loadingTemplate?: TemplateRef<any>;
    @ContentChild('error') errorTemplate?: TemplateRef<any>;
    @ContentChild('empty') emptyTemplate?: TemplateRef<any>;
}
