import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SimulationRequest } from 'src/app/shared/models/simulation-request';
import { EnvironmentService } from '../../environment/environment.service';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  constructor(
    private http: HttpClient,
    private environment: EnvironmentService
  ) {}

  static PATH = '/api/v1/corporate/prospect';

  doSimulation(request: SimulationRequest): Observable<any> {
    return this.http.post(
      `${this.environment.apiUrl}${SimulationService.PATH}`,
      {
        name: request.name,
        cpf: request.cpf,
        email: request.email,
        loanAmount: request.loanAmount,
        quantity: request.quantity,
      }
    );
  }
}
