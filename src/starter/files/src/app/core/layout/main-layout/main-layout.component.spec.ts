import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MainLayoutComponent } from './main-layout.component';
import { NavComponent } from '../nav/nav.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxWizSSOModule } from '@wizsolucoes/ngx-wiz-sso';
import { ssoConfig } from '../../../../config/sso_config';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NgxWizSSOModule.forRoot(ssoConfig),
      ],
      declarations: [MainLayoutComponent, NavComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
