import { Component, input, output } from '@angular/core';
import { Skeleton } from './skeleton/skeleton';
import { FallBack } from '@/shared/components/error/fall-back/fall-back';

@Component({
    selector: 'stat-card',
    imports: [Skeleton, FallBack],
    templateUrl: './stat-card.html'
})
export class StatCard {
    title = input.required<string>();
    value = input.required<string | number>();
    description = input.required<string>();
    loading = input<boolean>(false);
    error = input.required<boolean>();
    message = input<string>();
    retry = output<void>();

    
}
