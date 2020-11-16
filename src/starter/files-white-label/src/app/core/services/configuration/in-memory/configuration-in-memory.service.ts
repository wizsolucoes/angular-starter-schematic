import { Injectable } from '@angular/core';
import { AppConfiguration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationInMemoryService {
  private configuration: AppConfiguration;

  saveConfiguration(configuration: AppConfiguration) {
    this.configuration = configuration;
  }

  getConfiguration(): AppConfiguration {
    return this.configuration;
  }
}
