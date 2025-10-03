import { Component, input } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-data-view-skeleton',
  imports: [SkeletonModule],
  templateUrl: './data-view-skeleton.html',
})
export class DataViewSkeleton {
rows = input<number>(5);

    get skeletonArray() {
        return Array(this.rows());
    }
}
