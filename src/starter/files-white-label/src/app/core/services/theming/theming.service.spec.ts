import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from 'src/app/app.component';
import { CoreModule } from '../../core.module';
import { MainLayoutComponent } from '../../layout/main-layout/main-layout.component';
import { ThemingService } from './theming.service';

describe('ThemingService', () => {
  let service: ThemingService;
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let template: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule, HttpClientTestingModule],
      declarations: [AppComponent, MainLayoutComponent],
      providers: [],
    });
    service = TestBed.inject(ThemingService);
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    template = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set properties on element', () => {
    // When
    service.setCSSVariables(fixture, {
      primaryColor: 'teal',
      accentColor: 'pink'
    });

    // Then
    expect(template.style.getPropertyValue('--primary-color')).toBe('teal');
    expect(template.style.getPropertyValue('--accent-color')).toBe('pink');
    expect(template.style.getPropertyValue('--syz-primary-color')).toBe('teal');
    expect(template.style.getPropertyValue('--syz-accent-color')).toBe('pink');
  });
});
