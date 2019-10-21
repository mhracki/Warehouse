import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { LayoutModule } from '@angular/cdk/layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './shared/login.service';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ItemComponent } from './warehouse/item/item.component';
import { ItemListComponent } from './warehouse/item-list/item-list.component';
import { ItemService } from './shared/item.service';
import { SchemaComponent } from './warehouse/schema/schema.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WarehouseComponent,
    ItemComponent,
    ItemListComponent,
    SchemaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LayoutModule
  ],
  providers: [LoginService,ItemService],
  bootstrap: [AppComponent],
  entryComponents:[ItemComponent]
})
export class AppModule { }
