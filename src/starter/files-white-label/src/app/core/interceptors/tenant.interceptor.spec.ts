import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../services/configuration/configuration.service';
import { TenantInterceptor } from './tenant.interceptor';

@Injectable()
export class AnyHttpService {
  static ANY_PATH: string = '/any';

  constructor(private http: HttpClient) {}

  anyAction(): Observable<any> {
    return this.http.get(AnyHttpService.ANY_PATH);
  }
}

describe('TenantInterceptor', () => {
  let service: AnyHttpService;
  let httpMock: HttpTestingController;
  let mockConfigurationService: jasmine.SpyObj<ConfigurationService>;

  beforeEach(() => {
    mockConfigurationService = jasmine.createSpyObj(
      'mockConfigurationService',
      ['']
    );

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AnyHttpService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TenantInterceptor,
          multi: true,
        },
        { provide: ConfigurationService, useValue: mockConfigurationService },
      ],
    });

    service = TestBed.inject(AnyHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it(`should add ${TenantInterceptor.X_TENANT_HEADER} header`, () => {
    // Given
    const anyTenantId = 'any';
    mockConfigurationService.tenantId = anyTenantId;

    // When
    service.anyAction().subscribe((val) => {
      expect(val).toBeTruthy();
    });

    // Then
    const httpRequest = httpMock.expectOne(AnyHttpService.ANY_PATH);

    expect(
      httpRequest.request.headers.has(TenantInterceptor.X_TENANT_HEADER)
    ).toEqual(true);

    expect(
      httpRequest.request.headers.get(TenantInterceptor.X_TENANT_HEADER)
    ).toBe(anyTenantId);
  });
});
