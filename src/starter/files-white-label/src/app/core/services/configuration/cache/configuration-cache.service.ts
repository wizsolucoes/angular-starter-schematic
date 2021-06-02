import { Injectable } from '@angular/core';
import { AppConfiguration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationCacheService {
  private cacheKey = 'app_configuration';

  getConfiguration(): AppConfiguration | undefined {
    return JSON.parse(localStorage.getItem(this.cacheKey)!);
  }
  saveConfiguration(configuration: AppConfiguration): void {
    localStorage.setItem(this.cacheKey, JSON.stringify(configuration));
  }

  constructor() {}
}
