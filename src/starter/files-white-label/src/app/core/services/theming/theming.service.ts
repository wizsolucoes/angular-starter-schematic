import { Injectable, ElementRef } from '@angular/core';
import { AppConfiguration } from '../configuration/configuration';

@Injectable({
  providedIn: 'root',
})
export class ThemingService {
  setCSSVariables(el: ElementRef, propertyMap: AppConfiguration) {
    el.nativeElement.style.setProperty(
      `--primary-color`,
      propertyMap.primaryColor
    );

    el.nativeElement.style.setProperty(
      `--accent-color`,
      propertyMap.accentColor
    );

    el.nativeElement.style.setProperty(
      `--syz-primary-color`,
      propertyMap.primaryColor
    );

    // You can use this loop if the API retuns CSS properites in snake case (Eg. primary-color)
    Object.keys(propertyMap).forEach((key) => {
      el.nativeElement.style.setProperty(`--${key}`, propertyMap[key]);
    });
  }
}
