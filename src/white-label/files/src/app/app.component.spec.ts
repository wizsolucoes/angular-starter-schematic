import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { AppConfiguration } from './core/services/configuration/configuration';
import { ConfigurationService } from './core/services/configuration/configuration.service';
import { CoreModule } from './core/core.module';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { ThemingService } from './core/services/theming/theming.service';

describe('AppComponent', () => {
  let mockThemingSerivce: jasmine.SpyObj<ThemingService>;
  let mockConfigService: jasmine.SpyObj<ConfigurationService>;
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let template: HTMLElement;
  let data: AppConfiguration;

  beforeEach(() => {
    mockThemingSerivce = jasmine.createSpyObj('ThemingService', [
      'setCSSVariables',
    ]);

    mockConfigService = jasmine.createSpyObj('ConfigurationService', [
      'getConfig',
      'disableCache',
    ]);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule, HttpClientTestingModule],
      declarations: [AppComponent, MainLayoutComponent],
      providers: [
        { provide: ThemingService, useValue: mockThemingSerivce },
        { provide: ConfigurationService, useValue: mockConfigService },
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    template = fixture.nativeElement;
  });

  beforeEach(() => {
    data = {
      theme: {
        'primary-color': 'red',
        'secondary-color': 'teal',
      },
    };

    mockConfigService.getConfig.and.returnValue(of(data));
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should delegate theming to theming service', () => {
    // Act / When
    fixture.detectChanges();

    // Assert / Then
    expect(mockThemingSerivce.setCSSVariables).toHaveBeenCalledWith(
      fixture.elementRef,
      data.theme
    );
  });

  it('should NOT render main layout when loading configuration', () => {
    // Given
    app.isLoadingConfiguration = true;

    // Then
    expect(template.querySelector('app-main-layout')).toBeFalsy();
  });

  it('should render main layout after it loads configuration', () => {
    // Act / When
    fixture.detectChanges();

    // Assert / Then
    expect(template.querySelector('app-main-layout')).toBeTruthy();
  });
});
