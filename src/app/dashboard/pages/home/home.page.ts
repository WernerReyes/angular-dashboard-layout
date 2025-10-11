import { Component } from '@angular/core';

import { StatsWidget } from './components/stats-widget/stats-widget';
import { RecentPages } from './components/recent-pages/recent-pages';
import { RecentCategories } from './components/recent-categories/recent-categories';

@Component({
    selector: 'app-home-page',
    imports: [StatsWidget, RecentPages, RecentCategories],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <home-stats-widget class="contents" />
            <div class="col-span-12 xl:col-span-6">
                <home-recent-pages />
            </div>
            <div class="col-span-12 xl:col-span-6">
                <home-recent-categories />
            </div>
        </div>
    `
})
export default class HomePage {
    constructor() {}
}
           