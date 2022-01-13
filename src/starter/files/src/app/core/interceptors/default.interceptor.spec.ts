import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { DefaultInterceptor } from './default.interceptor';

@Injectable()
export class AnyHttpService {
  static ANY_PATH: string = '/any';

  constructor(private http: HttpClient) {}

  anyAction(): Observable<any> {
    return this.http.get(AnyHttpService.ANY_PATH);
  }
}

describe('DefaultInterceptor', () => {
  let service: AnyHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AnyHttpService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: DefaultInterceptor,
          multi: true,
        },
      ],
    });

    service = TestBed.inject(AnyHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it(`should add an ${DefaultInterceptor.X_HEADER} header`, () => {
    // When
    service.anyAction().subscribe((val) => {
      expect(val).toBeTruthy();
    });

    // Then
    const httpRequest = httpMock.expectOne(AnyHttpService.ANY_PATH);
    expect(
      httpRequest.request.headers.has(DefaultInterceptor.X_HEADER)
    ).toEqual(true);
  });
});
