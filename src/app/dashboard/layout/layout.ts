
import { LayoutService } from '@/shared/services/layout.service';
import { MessageService } from '@/shared/services/message.service';
import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MessageService as MessageServicePrime } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { filter, Subscription } from 'rxjs';
// import { SessionExpiredDialog } from '../components/session-expired-dialog/session-expired-dialog';
import { Sidebar } from '../components/sidebar/sidebar';
import { Topbar } from '../components/topbar/topbar';
import { SessionExpiredDialog } from '@/auth/components/session-expired-dialog/session-expired-dialog';
import { SessionExpiredService } from '@/shared/services/session-expired.service';
import { AuthTimerService } from '@/shared/services/auth-timer.service';


@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, SessionExpiredDialog, Topbar, Sidebar, RouterModule, ToastModule],
    templateUrl: './layout.html',
    providers: [MessageServicePrime]
})
export class DashboardLayout implements OnInit, OnDestroy {
    private readonly messageServicePrime = inject(MessageServicePrime);
    private readonly dialog = inject(SessionExpiredService);
    private readonly messageService = inject(MessageService);
    private readonly layoutService = inject(LayoutService);
    private readonly router = inject(Router);
    private readonly renderer = inject(Renderer2);
    private readonly authTimerService = inject(AuthTimerService);

    overlayMenuOpenSubscription: Subscription;

    menuOutsideClickListener: any;

    @ViewChild(Sidebar) sidebar!: Sidebar;

    @ViewChild(Topbar) topBar!: Topbar;


    constructor() {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                    if (this.isOutsideClicked(event)) {
                        this.hideMenu();
                    }
                });
            }

            if (this.layoutService.layoutState().staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.hideMenu();
        });

        window.addEventListener('storage', (event) => {
            if (event.key === 'session_refresh') {
                // 🔹 Otro tab detectó que hubo un relogin
                this.authTimerService.onSessionRefresh();
            }
        });
    }

    ngOnInit() {
        this.authTimerService.startMonitoring();
    }

    private showSuccess = effect(() => {
        const { message, summary } = this.messageService.success();
        if (message) {
            this.messageServicePrime.add({ severity: 'success', summary, detail: message, life: 3000 });
            this.messageService.clearSuccess();
        }
    });

    private showError = effect(() => {
        const { message, summary } = this.messageService.error();
        if (message) {
            this.messageServicePrime.add({ severity: 'error', summary, detail: message, life: 3000 });
            this.messageService.clearError();
        }
    });

    isOutsideClicked(event: MouseEvent) {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarEl = document.querySelector('.layout-menu-button');
        const eventTarget = event.target as Node;

        return !(sidebarEl?.isSameNode(eventTarget) || sidebarEl?.contains(eventTarget) || topbarEl?.isSameNode(eventTarget) || topbarEl?.contains(eventTarget));
    }

    hideMenu() {
        this.layoutService.layoutState.update((prev) => ({ ...prev, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
            'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
            'layout-static-inactive': this.layoutService.layoutState().staticMenuDesktopInactive && this.layoutService.layoutConfig().menuMode === 'static',
            'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
            'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive
        };
    }

    ngOnDestroy() {
        this.authTimerService.stopMonitoring();
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
