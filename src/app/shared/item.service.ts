import { Injectable } from '@angular/core';
import { Item } from './item.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatTableDataSource,MatSort,MatPaginator,} from "@angular/material";
import { sanitizeIdentifier } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  formData:Item;
  itemList: Item[] ;
  dataTable:MatTableDataSource<any>;

  
  constructor(private http:HttpClient) { }
  
  

  postNewItem(){
    console.log(this.formData);
      
    return this.http.post(`${environment.apiWarehouseURL}/item`,this.formData)
  }

  getItemList(){
    return this.http.get(`${environment.apiWarehouseURL}/list`).toPromise();
  }

  refreshList(){
    return this.getItemList().then( res=>{ return this.itemList = res as Item[]})
  }
  getMaterial(itemsList){
    
    
    return this.getItemList().then(()=>{this.dataTable = new MatTableDataSource(itemsList);console.log(this.dataTable);} )
  }


  deleteItem(id){
    console.log(id);
    return this.http.delete(`${environment.apiWarehouseURL}/delitem/${id}`).toPromise();
       
  }

  initializeForm(item:Item){
    this.formData = {
      id: item.id,
      itemName: item.itemName,
      quantity: item.quantity,
      warehouse: item.warehouse,
      room:item.side,
      column:item.column,
      rack: item.rack,
      side: item.side,
      shelf: item.shelf,
      place: item.place
    };
  }
  editItem(item:Item){
       
    return this.http.put(`${environment.apiWarehouseURL}/putitem/${item.id}`,item)
    
  }
  
}
