import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/*
 * This service allows for injection of environment settings to avoid hard dependency on
 * environment files. Facilitates testing units that depend on environment settings.
 */

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  production: boolean = environment.production;
  ssoConfig = environment.ssoConfig;
  };