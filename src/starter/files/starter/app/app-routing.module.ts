import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'documentation',
    loadChildren: () =>
      import('./features/documentation/documentation.module').then(
        (m) => m.DocumentationModule
      ),
  },
  {
    path: 'sales',
    loadChildren: () =>
      import('./features/sales/sales.module').then((m) => m.SalesModule),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
