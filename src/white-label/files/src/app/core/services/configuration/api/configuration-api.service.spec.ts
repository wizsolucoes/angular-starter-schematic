import { TestBed } from '@angular/core/testing';

import { ConfigurationApiService } from './configuration-api.service';
import { HttpClient } from '@angular/common/http';

import getConfigApiResponse from '../../../../../testing/fakes/api-responses/get-config.json';
import { of } from 'rxjs';

describe('ConfigurationApiService', () => {
  let service: ConfigurationApiService;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: mockHttpClient }],
    });
    service = TestBed.inject(ConfigurationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch config', () => {
    // Given
    const apiResponse = getConfigApiResponse;
    mockHttpClient.get.and.returnValue(of(apiResponse));

    // When
    const configObservable = service.fetchConfig();

    // Then
    configObservable.subscribe((data) => {
      expect(data).toEqual(jasmine.objectContaining(apiResponse));
    });
  });
});
