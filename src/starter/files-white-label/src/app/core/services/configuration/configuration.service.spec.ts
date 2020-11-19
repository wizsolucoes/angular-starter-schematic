import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import getConfigApiResponse from '../../../../testing/fakes/api-responses/get-config.json';
import { ConfigurationApiService } from './api/configuration-api.service';
import { ConfigurationCacheService } from './cache/configuration-cache.service';
import { ConfigurationService } from './configuration.service';
import defaultConfig from './default-configuration';
import { ConfigurationInMemoryService } from './in-memory/configuration-in-memory.service';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let mockApi: jasmine.SpyObj<ConfigurationApiService>;
  let mockCache: jasmine.SpyObj<ConfigurationCacheService>;
  let mockInMemory: jasmine.SpyObj<ConfigurationInMemoryService>;

  beforeEach(() => {
    mockApi = jasmine.createSpyObj('ConfigurationApiService', ['fetchConfig']);
    mockCache = jasmine.createSpyObj('ConfigurationCacheService', [
      'getConfiguration',
      'saveConfiguration',
    ]);
    mockInMemory = jasmine.createSpyObj('ConfigurationInMemoryService', [
      'getConfiguration',
      'saveConfiguration',
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigurationApiService, useValue: mockApi },
        { provide: ConfigurationCacheService, useValue: mockCache },
        { provide: ConfigurationInMemoryService, useValue: mockInMemory },
      ],
    });
    service = TestBed.inject(ConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('configuration api request fails', () => {
    beforeEach(() => {
      mockApi.fetchConfig.and.returnValue(throwError({}));
    });

    it('should return a default config from source code', () => {
      // When
      const configObservable = service.getConfig();

      // Then
      configObservable.subscribe((data) => {
        expect(data).toEqual(jasmine.objectContaining(defaultConfig));
      });
    });
  });

  describe('configuration is in memory', () => {
    it('should get configuration from memory if available', () => {
      // Given
      mockInMemory.getConfiguration.and.returnValue({ foo: 'memory' });
      // When
      service.getConfig();

      // Then
      expect(mockCache.getConfiguration).not.toHaveBeenCalled();
      expect(mockApi.fetchConfig).not.toHaveBeenCalled();
    });
  });

  describe('configuration is not in memory and cache is enabled', () => {
    beforeEach(() => {
      mockInMemory.getConfiguration.and.returnValue(undefined);
      service.enableCache();
    });

    it('should get config from cache if available', () => {
      mockCache.getConfiguration.and.returnValue({ foo: 'cache' });

      // When
      const configObservable = service.getConfig();

      // Then
      configObservable.subscribe((data) => {
        expect(data).toEqual(jasmine.objectContaining({ foo: 'cache' }));
      });
    });

    it('should save config in memory after cache response', () => {
      // Given
      mockCache.getConfiguration.and.returnValue({ foo: 'bar' });

      // When
      const configObservable = service.getConfig();

      // Then
      configObservable.subscribe((data) => {
        expect(mockInMemory.saveConfiguration).toHaveBeenCalledWith({
          foo: 'bar',
        });
      });
    });

    it('should get config from api if cache is not available', () => {
      // Given
      mockCache.getConfiguration.and.returnValue(undefined);
      mockApi.fetchConfig.and.returnValue(of(getConfigApiResponse));

      // When
      const configObservable = service.getConfig();

      // Then
      configObservable.subscribe((data) => {
        expect(data).toEqual(jasmine.objectContaining(getConfigApiResponse));
      });
    });

    it('should save config in memory after api response', () => {
      // Given
      mockCache.getConfiguration.and.returnValue(undefined);
      mockApi.fetchConfig.and.returnValue(of(getConfigApiResponse));

      // When
      const configObservable = service.getConfig();

      // Then
      configObservable.subscribe((data) => {
        expect(mockInMemory.saveConfiguration).toHaveBeenCalledWith(
          getConfigApiResponse
        );
      });
    });

    it('should save config in cache after api response', () => {
      // Given
      mockCache.getConfiguration.and.returnValue(undefined);
      mockApi.fetchConfig.and.returnValue(of(getConfigApiResponse));

      // When
      const configObservable = service.getConfig();

      // Then
      configObservable.subscribe((data) => {
        expect(mockCache.saveConfiguration).toHaveBeenCalledWith(
          getConfigApiResponse
        );
      });
    });
  });

  describe('configuration is not in memory and cache is disabled', () => {
    beforeEach(() => {
      mockInMemory.getConfiguration.and.returnValue(undefined);
      service.disableCache();
    });

    it('should NOT check cache', () => {
      // Given
      mockApi.fetchConfig.and.returnValue(of(getConfigApiResponse));

      // When
      service.getConfig();

      // Then
      expect(mockCache.getConfiguration).not.toHaveBeenCalled();
    });

    it('should get config from api', () => {
      // Given
      mockApi.fetchConfig.and.returnValue(of(getConfigApiResponse));

      // When
      const configObservable = service.getConfig();

      // Then
      configObservable.subscribe((data) => {
        expect(data).toEqual(jasmine.objectContaining(getConfigApiResponse));
      });
    });

    it('should save config in memory after api response', () => {
      // Given
      mockApi.fetchConfig.and.returnValue(of(getConfigApiResponse));

      // When
      const configObservable = service.getConfig();

      // Then
      configObservable.subscribe((data) => {
        expect(mockInMemory.saveConfiguration).toHaveBeenCalledWith(
          getConfigApiResponse
        );
      });
    });

    it('should NOT save config in cache after api response', () => {
      // Given
      mockApi.fetchConfig.and.returnValue(of(getConfigApiResponse));

      // When
      const configObservable = service.getConfig();

      // Then
      configObservable.subscribe((data) => {
        expect(mockCache.saveConfiguration).not.toHaveBeenCalled();
      });
    });
  });
});
