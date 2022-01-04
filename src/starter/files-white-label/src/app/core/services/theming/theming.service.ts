import { Injectable } from '@angular/core';
import { AppConfiguration } from '../configuration/configuration';

@Injectable({
  providedIn: 'root',
})
export class ThemingService {
  setCSSVariables(document: Document, propertyMap: AppConfiguration): void {
    document.body.style.setProperty(
      `--primary-color`,
      propertyMap['primaryColor']
    );

    document.body.style.setProperty(
      `--accent-color`,
      propertyMap['accentColor']
    );

    document.body.style.setProperty(
      `--syz-primary-color`,
      propertyMap['primaryColor']
    );

    document.body.style.setProperty(
      `--syz-accent-color`,
      propertyMap['accentColor']
    );

    // You can use this loop if the API retuns CSS properites in snake case (Eg. primary-color)
    Object.keys(propertyMap).forEach((key) => {
      document.body.style.setProperty(`--${key}`, propertyMap[key]);
    });
  }
}
