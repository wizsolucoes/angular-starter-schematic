import { Injectable, ErrorHandler } from '@angular/core';
import { EnvironmentService } from '../environment/environment.service';
import { MonitoringService } from './monitoring.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService extends ErrorHandler {
  constructor(
    private monitoringService: MonitoringService,
    private environment: EnvironmentService
  ) {
    super();
  }

  handleError(error: Error): void {
    if (!this.environment.production) {
      console.error(error);
      return;
    }

    this.monitoringService.logException(error);
  }
}
