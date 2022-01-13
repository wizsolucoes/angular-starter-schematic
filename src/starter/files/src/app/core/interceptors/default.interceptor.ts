import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  static X_HEADER: string = 'X-Header';

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      headers: request.headers.append(
        DefaultInterceptor.X_HEADER,
        '<<some value>>'
      ),
    });
    return next.handle(request);
  }
}
