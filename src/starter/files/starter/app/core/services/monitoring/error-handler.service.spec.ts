import { TestBed } from '@angular/core/testing';

import { ErrorHandlerService } from './error-handler.service';
import { MonitoringService } from './monitoring.service';
import { EnvironmentService } from '../environment/environment.service';

describe('ErrorHandlerService', () => {
  const environment = new EnvironmentService();

  describe('in production mode', () => {
    let service: ErrorHandlerService;
    let mockMonitoringService: jasmine.SpyObj<MonitoringService>;

    beforeEach(() => {
      environment.production = true;
      mockMonitoringService = jasmine.createSpyObj('MonitoringService', [
        'logException',
      ]);
      TestBed.configureTestingModule({
        providers: [
          { provide: MonitoringService, useValue: mockMonitoringService },
          { provide: EnvironmentService, useValue: environment },
        ],
      });
      service = TestBed.inject(ErrorHandlerService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should call monitoringService #logException', () => {
      // Given
      const error = new Error('fake error');

      // When
      service.handleError(error);

      // Then
      expect(mockMonitoringService.logException).toHaveBeenCalled();
    });
  });

  describe('NOT in production mode', () => {
    let service: ErrorHandlerService;
    let mockMonitoringService: jasmine.SpyObj<MonitoringService>;

    beforeEach(() => {
      environment.production = false;
      mockMonitoringService = jasmine.createSpyObj('MonitoringService', [
        'logException',
      ]);
      TestBed.configureTestingModule({
        providers: [
          { provide: MonitoringService, useValue: mockMonitoringService },
          { provide: EnvironmentService, useValue: environment },
        ],
      });
      service = TestBed.inject(ErrorHandlerService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should NOT call monitoringService #logException', () => {
      // Given
      const error = new Error('fake error');

      // When
      service.handleError(error);

      // Then
      expect(mockMonitoringService.logException).not.toHaveBeenCalled();
    });
  });
});
