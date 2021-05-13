import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from 'src/app/app.component';
import { CoreModule } from '../../core.module';
import { MainLayoutComponent } from '../../layout/main-layout/main-layout.component';
import { ThemingService } from './theming.service';
import { NgApplicationInsightsService } from '@wizsolucoes/ng-application-insights';

describe('ThemingService', () => {
  let service: ThemingService;
  let mockAppInsightsService: jasmine.SpyObj<NgApplicationInsightsService>;

  mockAppInsightsService = jasmine.createSpyObj(
    'NgApplicationInsightsService',
    ['setCustomProperties']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule, HttpClientTestingModule],
      declarations: [AppComponent, MainLayoutComponent],
      providers: [
        {
          provide: NgApplicationInsightsService,
          useValue: mockAppInsightsService,
        },
      ],
    });
    service = TestBed.inject(ThemingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set properties on element', () => {
    // When
    service.setCSSVariables(document, {
      primaryColor: 'teal',
      accentColor: 'pink',
    });

    // Then
    expect(document.body.style.getPropertyValue('--primary-color')).toBe(
      'teal'
    );
    expect(document.body.style.getPropertyValue('--accent-color')).toBe('pink');
    expect(document.body.style.getPropertyValue('--syz-primary-color')).toBe(
      'teal'
    );
    expect(document.body.style.getPropertyValue('--syz-accent-color')).toBe(
      'pink'
    );
  });
});
