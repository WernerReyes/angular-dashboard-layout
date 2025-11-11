import { LayoutService } from '@/shared/services/layout.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, computed, inject, signal } from '@angular/core';

@Component({
    selector: 'app-company-logo',
    imports: [],
    templateUrl: './company-logo.html'
})
export class CompanyLogo {
    readonly layoutService = inject(LayoutService);
    private readonly breakpointObserver = inject(BreakpointObserver);

    isDarkTheme = this.layoutService.isDarkTheme();

    fillColor = computed(() => (this.layoutService.isDarkTheme() ? '#FFFFFF' : '#26489e'));


    isMobile = signal<boolean>(false) ;

    constructor() {
        this.breakpointObserver
            .observe(['(max-width: 30rem)']) // también puedes usar '(max-width: 768px)'
            .subscribe((result) => {
                this.isMobile.set(result.matches);
            });
    }
}
