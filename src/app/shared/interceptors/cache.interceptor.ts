import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

const cache = new Map<
    string,
    {
        expiresAt: number;
        res: HttpResponse<unknown>;
    }
>();

const TTL = 300000; // 5 minutes

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.method !== 'GET') {
        return next(req);
    }

    const cacheKey = JSON.stringify({
        url: req.urlWithParams,
        headers: req.headers.keys().reduce(
            (acc, key) => {
                acc[key] = req.headers.get(key);
                return acc;
            },
            {} as Record<string, string | null>
        )
    });

    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
        return of(cached.res);
    } else {
        cache.delete(cacheKey);
    }

    return next(req).pipe(
        tap((event) => {
            if (event instanceof HttpResponse) {
                cache.set(cacheKey, {
                    expiresAt: Date.now() + TTL,
                    res: event
                });
            }
        })
    );
};
