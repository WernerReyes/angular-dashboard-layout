// session-expired-dialog.service.ts
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class SessionExpiredService {
    private router = inject(Router);

    visible = signal<boolean>(false);
    totalTime = signal<number>(18);
    remainingTime = signal<number>(18);

    private intervalId: number | null = null;

    progressPercentage = computed(() => {
        const total = this.totalTime();
        const remaining = this.remainingTime();
        return ((total - remaining) / total) * 100;
    });

    constructor() {
        effect(() => {
            if (this.visible()) this.startCountdown();
            else this.stopCountdown();
        });
    }

    show(timeInSeconds: number = 18) {
        this.totalTime.set(timeInSeconds);
        this.remainingTime.set(timeInSeconds);
        this.visible.set(true);
    }

    hide() {

                this.redirectToLogin();
                this.visible.set(false);
        
    
    }

    startCountdown() {
        this.stopCountdown();
        this.intervalId = window.setInterval(() => {
            const current = this.remainingTime();
            if (current <= 1) this.redirectToLogin();
            else this.remainingTime.set(current - 1);
        }, 1000);
    }

     stopCountdown() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

   

    private redirectToLogin() {
        this.stopCountdown();
        
        this.router.navigate(['/auth/login']);
    }
}
