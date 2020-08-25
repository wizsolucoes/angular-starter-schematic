import { Component, OnInit } from '@angular/core';
import { SimulationService } from 'src/app/core/services/business/simulation/simulation.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent {
  simulationResult: any;
  name: string;
  cpf: string;
  email: string;
  loanAmount: number;
  installments: number;
  isLoadingSimulation: boolean;

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
