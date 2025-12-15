import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';

import { toObservable } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    await firstValueFrom(
        toObservable(authService.initialized).pipe(
            filter((init) => init) // solo pasa cuando initialized = true

        )
    );

    if (!authService.isAuthenticated()) {
        router.navigateByUrl('/auth/login');
        return false;
    }

    return true;
};
