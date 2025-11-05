import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const newReq = req.clone({
        withCredentials: true,
        headers: req.headers.set('Authorization', `Bearer ${localStorage.getItem('_session_token') || ''}`)
    });
    return next(newReq);
}
