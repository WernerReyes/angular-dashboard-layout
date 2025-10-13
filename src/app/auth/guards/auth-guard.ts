import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';

import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const isAuthenticated = await firstValueFrom(authService.me());

    if (!isAuthenticated) {
        router.navigateByUrl('/auth/login');
        return false;
    }

    return true;
};
