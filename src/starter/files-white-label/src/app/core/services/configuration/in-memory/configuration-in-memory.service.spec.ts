import { TestBed } from '@angular/core/testing';

import { ConfigurationInMemoryService } from './configuration-in-memory.service';

describe('ConfigurationInMemoryService', () => {
  let service: ConfigurationInMemoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigurationInMemoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get app configuration', () => {
    service.saveConfiguration({ foo: 'bar' });

    expect(service.getConfiguration()).toEqual({ foo: 'bar' });
  });
});
