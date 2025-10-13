
import { AuthTimerService } from '@/shared/services/auth-timer.service';
import { SessionExpiredService } from '@/shared/services/session-expired.service';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'session-expired-dialog',
    imports: [DialogModule, ButtonModule],
    templateUrl: './session-expired-dialog.html'
})
export class SessionExpiredDialog {
    private readonly sessionExpiredService = inject(SessionExpiredService);
    readonly authTimerService = inject(AuthTimerService);

    visible = this.sessionExpiredService.visible;
    totalTime = this.sessionExpiredService.totalTime;
    remainingTime = this.sessionExpiredService.remainingTime;

    // Computed para el porcentaje de progreso
    progressPercentage = this.sessionExpiredService.progressPercentage;
}
