import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { SchemaComponent } from './warehouse/schema/schema.component';
import { WarehouseManagementComponent } from './warehouse/warehouse-management/warehouse-management.component';



const routes: Routes = [
  {path: '', redirectTo: 'new', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'schema', component: SchemaComponent},

  {path: 'warehouse', component: WarehouseComponent, canActivate: [AuthGuard]},
  {path: 'new', component: WarehouseManagementComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
