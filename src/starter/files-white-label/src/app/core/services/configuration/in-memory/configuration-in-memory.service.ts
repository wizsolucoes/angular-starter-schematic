import { Injectable } from '@angular/core';
import { AppConfiguration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationInMemoryService {
  private configuration: AppConfiguration | undefined;

  saveConfiguration(configuration: AppConfiguration): void {
    this.configuration = configuration;
  }

  getConfiguration(): AppConfiguration | undefined {
    return this.configuration;
  }
}
