import { Component, input, Input } from '@angular/core';
import { Skeleton } from './skeleton/skeleton';

@Component({
    selector: 'stat-card',
    imports: [Skeleton],
    templateUrl: './stat-card.html',
})
export class StatCard {
    title = input.required<string>();
    value = input.required<string | number>()
    description = input.required<string>();
    loading = input<boolean>(false);
}
