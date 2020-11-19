import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AppConfiguration } from '../configuration';
import { EnvironmentService } from '../../environment/environment.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationApiService {
  constructor(
    private http: HttpClient,
    private environment: EnvironmentService
  ) {}

  fetchConfig(): Observable<AppConfiguration> {
    return this.http.get(`${this.environment.apiUrl}/config`);
  }
}
