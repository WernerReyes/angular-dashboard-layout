import { ErrorBoundary } from '@/shared/components/error/error-boundary/error-boundary';
import { CardSkeleton } from '@/shared/components/skeleton/card-skeleton/card-skeleton';
import type { ResourceState } from '@/shared/interfaces/resource';
import { Component, input } from '@angular/core';

@Component({
    selector: 'stat-card',
    imports: [ErrorBoundary, CardSkeleton],
    templateUrl: './stat-card.html'
})
export class StatCard {
    title = input.required<string>();
    value = input.required<string | number>();
    description = input.required<string>();
    message = input<string>();
  

    resource = input.required<ResourceState<any[]>>();

    
}
