import { TestBed } from '@angular/core/testing';

import { SimulationService } from './simulation.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { SimulationRequest } from 'src/app/shared/models/simulation-request';
import { EnvironmentService } from '../../environment/environment.service';

describe('SimulationService', () => {
  let service: SimulationService;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;
  const environment = new EnvironmentService();

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['post']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpClient, useValue: mockHttpClient }],
    });
    service = TestBed.inject(SimulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send simulation request to http client', () => {
    // Given
    const fakeRequest: SimulationRequest = {
      name: 'My name',
      cpf: '13707098036',
      email: 'test@test.com',
      loanAmount: 100000,
      quantity: 20,
    };

    // When
    service.doSimulation(fakeRequest);

    // THen
    expect(mockHttpClient.post).toHaveBeenCalledWith(
      `${environment.apiUrl}${SimulationService.PATH}`,
      jasmine.objectContaining(fakeRequest)
    );
  });
});
