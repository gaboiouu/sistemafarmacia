import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { VentasRoutingModule } from './ventas-routing.module';
import { VentasComponent } from './ventas.component';


@NgModule({
  declarations: [
    VentasComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    ReactiveFormsModule
  ]
})
export class VentasModule { }
