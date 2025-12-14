import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const notAuthenticatedGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    await firstValueFrom(
        toObservable(authService.initialized).pipe(
            filter((init) => init) // solo pasa cuando initialized = true
        )
    );

    if (authService.isAuthenticated()) {
        router.navigateByUrl('/dashboard');
        return false;
    }

    return true;
};
