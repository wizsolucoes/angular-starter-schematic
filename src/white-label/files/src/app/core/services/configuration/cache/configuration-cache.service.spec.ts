import { TestBed } from '@angular/core/testing';

import { ConfigurationCacheService } from './configuration-cache.service';

describe('ConfigurationCacheService', () => {
  let service: ConfigurationCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigurationCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get configuration', () => {
    // Given
    const data = { foo: 'bar' };

    // When
    service.saveConfiguration(data);

    // Then
    expect(service.getConfiguration()).toEqual(data);
  });
});
