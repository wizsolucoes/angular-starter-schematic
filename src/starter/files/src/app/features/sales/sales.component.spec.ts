import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SalesComponent } from './sales.component';
import { SimulationService } from 'src/app/core/services/business/simulation/simulation.service';
import { of } from 'rxjs';
import { SimulationRequest } from 'src/app/shared/models/simulation-request';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSyzCpfSearchModule } from '@wizsolucoes/ng-syz';

describe('SalesComponent', () => {
  let component: SalesComponent;
  let fixture: ComponentFixture<SalesComponent>;
  let mockSimulationService: jasmine.SpyObj<SimulationService>;

  beforeEach(() => {
    mockSimulationService = jasmine.createSpyObj('SimulationService', [
      'doSimulation',
    ]);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        SharedModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        NgSyzCpfSearchModule,
      ],
      declarations: [SalesComponent],
      providers: [
        { provide: SimulationService, useValue: mockSimulationService },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ask simulation service to do simulations', () => {
    // Given
    const fakeRequest: SimulationRequest = {
      name: 'My name',
      cpf: '13707098036',
      email: 'test@test.com',
      loanAmount: 100000,
      quantity: 20,
    };

    component.name = fakeRequest.name;
    component.cpf = fakeRequest.cpf;
    component.email = fakeRequest.email;
    component.loanAmount = fakeRequest.loanAmount;
    component.installments = fakeRequest.quantity;

    mockSimulationService.doSimulation.and.returnValue(of({ foo: 'bar' }));

    // When
    component.onSubmit();

    // Then
    expect(mockSimulationService.doSimulation).toHaveBeenCalledWith(
      jasmine.objectContaining<SimulationRequest>(fakeRequest)
    );
  });

  it('should set simulationResult ', () => {
    // Given
    const fakeRequest: SimulationRequest = {
      name: 'My name',
      cpf: '13707098036',
      email: 'test@test.com',
      loanAmount: 100000,
      quantity: 20,
    };

    mockSimulationService.doSimulation.and.returnValue(of({ foo: 'bar' }));

    // When
    component.onSubmit();

    // Then
    mockSimulationService.doSimulation(fakeRequest).subscribe((data) => {
      expect(component.simulationResult).toEqual(
        jasmine.objectContaining(data)
      );
    });
  });
});
