import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    console.log('Auth guard invoked for route:', state.url);

    if (authService.isAuthenticated()) {
        return true;
    }

    return authService.me().pipe(
        map((user) => {
            console.log('Auth guard check:', user);
            if (user) {
                return true;
            } else {
                // router.navigate(['/auth/login']);
                return false;
            }
        }),
        catchError(() => {
            console.log('Navigation to login due to error in authentication check.');
            // router.navigate(['/auth/login']);
            return of(false);
        })
    );

};
