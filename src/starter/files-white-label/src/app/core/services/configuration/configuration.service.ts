import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ConfigurationApiService } from './api/configuration-api.service';
import { ConfigurationCacheService } from './cache/configuration-cache.service';
import { AppConfiguration } from './configuration';
import defaultConfig from './default-configuration';
import { ConfigurationInMemoryService } from './in-memory/configuration-in-memory.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor(
    private api: ConfigurationApiService,
    private cache: ConfigurationCacheService,
    private inMemory: ConfigurationInMemoryService
  ) {}

  tenantId = '';

  private isCacheEnabled = true;

  enableCache(): void {
    this.isCacheEnabled = true;
  }

  disableCache(): void {
    this.isCacheEnabled = false;
  }

  getConfig(): Observable<AppConfiguration> {
    const inMemoryConfiguration = this.getFromMemory();

    if (inMemoryConfiguration) {
      return of(inMemoryConfiguration);
    }

    if (this.isCacheEnabled) {
      const cacheResponse = this.cache.getConfiguration();

      return cacheResponse
        ? this.getFromCache(cacheResponse)
        : this.getFromApi(true);
    }

    return this.getFromApi();
  }

  getConfigSync(): AppConfiguration | undefined {
    return this.getFromMemory();
  }

  private getFromApi(isCacheEnabled = false): Observable<AppConfiguration> {
    return this.api
      .fetchConfig()
      .pipe(catchError((err) => of(defaultConfig)))
      .pipe(
        tap((val) => {
          this.inMemory.saveConfiguration(val);
          if (isCacheEnabled) {
            this.cache.saveConfiguration(val);
          }
        })
      );
  }

  private getFromCache(
    cacheResponse: AppConfiguration
  ): Observable<AppConfiguration> {
    return of(cacheResponse).pipe(
      tap((val) => {
        this.inMemory.saveConfiguration(val);
      })
    );
  }

  private getFromMemory(): AppConfiguration | undefined {
    return this.inMemory.getConfiguration();
  }
}
