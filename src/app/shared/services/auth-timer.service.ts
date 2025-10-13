import { AuthService } from '@/auth/services/auth.service';
import { Injectable, inject, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { SessionExpiredService } from './session-expired.service';

interface JwtPayload {
    exp: number;
    iat?: number;
    [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthTimerService {
    private readonly authService = inject(AuthService);
    private dialog = inject(SessionExpiredService);
    private checkInterval: number | null = null;

    alertShown = signal<boolean>(false);

    startMonitoring(intervalMs = 30000) {
        // cada 30 segundos
        this.stopMonitoring();

        // let alertShown = false;

        this.checkInterval = window.setInterval(() => {
            const token = this.authService.token();
            if (!token) return;

            try {
                const decoded = jwtDecode<JwtPayload>(token);
                if (!decoded.exp) return;

                const now = Date.now();
                const expiration = decoded.exp * 1000;
                const remaining = expiration - now;
                const remainingSeconds = Math.floor(remaining / 1000);

                console.log(`Token expires in ${remainingSeconds} seconds`);

                // Si faltan menos de 60 segundos y aún no mostramos alerta
                if (remaining > 0 && remaining <= 60000 && !this.alertShown()) {
                    this.alertShown.set(true);
                    this.dialog.show(remainingSeconds); // mostrar con los segundos reales restantes
                }

                // Si ya expiró
                if (remaining <= 0) {
                    this.alertShown.set(false);
                    this.dialog.show(0);
                    this.dialog.hide();
                    this.stopMonitoring();
                }
            } catch {
                // token inválido
                this.dialog.show(0);
                this.stopMonitoring();
            }
        }, intervalMs);
    }

    stopMonitoring() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

     onSessionRefresh() {
    // Cerrar el diálogo si estaba abierto
    this.dialog.visible.set(false);
    this.dialog.stopCountdown();
    this.alertShown.set(false);

    // Detener el monitoreo anterior
    this.stopMonitoring();

    // 🔹 Esperar unos milisegundos para asegurar que el nuevo token esté disponible
    setTimeout(() => {
        //TODO this.authService.token(); // Forzar la actualización del token
        this.startMonitoring();
        console.log('✅ Monitoring restarted with new token');
    }, 500);
}


     relogin() {
        this.authService.relogin().subscribe({
            next: () => {
                this.dialog.visible.set(false);
                this.dialog.stopCountdown();
                this.alertShown.set(false);
                this.startMonitoring();

                // this.hide();
                // this.redirectToLogin();

                 localStorage.setItem('session_refresh', Date.now().toString());
            }
        });
    }
}
