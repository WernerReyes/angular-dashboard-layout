import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { MessageService } from '../services/message.service';
import { ApiResponse } from '../interfaces/api-response';

export function handlerErrorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const messageService = inject(MessageService);
    
    return next(req).pipe(
        tap((res) => {
            if (res instanceof HttpResponse) {
                if (req.method === 'GET') return;
                const message = (res.body as ApiResponse<unknown>).message;
                if (message) {
                    messageService.setSuccess(message);
                }
            }
        }),
        catchError((error) => {
            const code = error.status;

            if (req.method === 'GET') {
                return throwError(() => error);
            }

            console.log(error);

            switch (code) {
                case HttpStatusCode.UnprocessableEntity:
                    
                    const details = error.error?.details;
                
                    const array = Object.values(details).flat() as string[];
                    messageService.setError(array[0]);
                    break;

                // case HttpStatusCode.BadRequest:
                //     messageService.setError(error?.error?.message);
                //     break;

                // case HttpStatusCode.NotFound:
                //     messageService.setError(error?.error?.message);
                //     break;
                
                // case HttpStatusCode.InternalServerError: 
                //     messageService.setError(error?.error?.message);
                //     break;
                default:
                    messageService.setError(error?.error?.message)
                    break;
                
            }


            return throwError(() => error);
        })
    );
}
