import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../services/configuration/configuration.service';

@Injectable()
export class TenantInterceptor implements HttpInterceptor {
  constructor(private configurationService: ConfigurationService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        'X-Tenant': this.configurationService.tenantId,
      },
    });
    return next.handle(request);
  }
}
