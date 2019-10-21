import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Material from '@angular/material'



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Material.MatToolbarModule,
    Material.MatFormFieldModule,
    Material.MatIconModule,
    Material.MatInputModule,
    Material.MatButtonModule,
    Material.MatTableModule,
    Material.MatPaginatorModule,
    Material.MatProgressSpinnerModule,
    Material.MatSortModule,
    Material.MatDialogModule
    
  ],
  exports: [
    Material.MatToolbarModule,
    Material.MatFormFieldModule,
    Material.MatIconModule,
    Material.MatInputModule,
    Material.MatButtonModule,
    Material.MatTableModule,
    Material.MatPaginatorModule,
    Material.MatProgressSpinnerModule,
    Material.MatSortModule,
    Material.MatDialogModule


    





  ]
})
export class MaterialModule { }
