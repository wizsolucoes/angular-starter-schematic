import { Component } from '@angular/core';
import { SimulationService } from 'src/app/core/services/business/simulation/simulation.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent {
  simulationResult: any;
  name: string | undefined;
  cpf: string | undefined;
  email: string | undefined;
  loanAmount: number | undefined;
  installments: number | undefined;
  isLoadingSimulation: boolean | undefined;

  constructor(private simulationService: SimulationService) {}

  onSubmit(): void {
    this.isLoadingSimulation = true;

    this.simulationService
      .doSimulation({
        name: this.name,
        cpf: this.cpf,
        email: this.email,
        loanAmount: this.loanAmount,
        quantity: this.installments,
      })
      .subscribe((data: any) => {
        this.simulationResult = data;
        this.isLoadingSimulation = false;
      });
  }
}
