import { Injectable } from '@angular/core';
import { Item } from './item.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatTableDataSource,MatSort,MatPaginator,} from "@angular/material";
import { sanitizeIdentifier } from '@angular/compiler';
import { Warehouse } from './models/warehouse.model';
import { Room } from './models/room.model';
import { Column } from './models/column.model';
import { Rack } from './models/rack.model';
import { Shelf } from './models/shelf.model';
import { Place } from './models/place.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  formData:Item;
  itemList: Item[] ;
  dataTable:MatTableDataSource<any>;
  warehouseList:Warehouse[];
  roomList:Room[];
  columnList:Column[];
  rackList:Rack[];
  shelfList:Shelf[];
  placeList:Place[];
  

  
  constructor(private http:HttpClient) { }
  
  

  postNewItem(){
    console.log(this.formData);
    delete  this.formData.id
    return this.http.post(`${environment.apiWarehouseURL}/item`,this.formData)
  }

  getItemList(){
    return this.http.get(`${environment.apiWarehouseURL}/list`).toPromise();
  }
  async getWarehouseList(){
     await this.http.get(`${environment.apiWarehouseURL}/warehouse`).toPromise().then(
       res=> {return this.warehouseList = res as Warehouse[]}
     );
     
  }
  async getRoomList(id){
     await this.http.get(`${environment.apiWarehouseURL}/room/${id}`).toPromise().then(
      res=> {return this.roomList = res as Room[]}
    );
    
 }
  async getColumnList(id){
    await this.http.get(`${environment.apiWarehouseURL}/column/${id}`).toPromise().then(
    res=> {return this.columnList = res as Column[]}
  );
  
}
async getRackList(id){
   await this.http.get(`${environment.apiWarehouseURL}/rack/${id}`).toPromise().then(
    res=> {return this.rackList = res as Rack[];}
  );
  
}
async getShelfList(id){
  await this.http.get(`${environment.apiWarehouseURL}/shelf/${id}`).toPromise().then(
    res=> {return this.shelfList = res as Shelf[]}
  );
  
}
async getPlaceList(id){
  await this.http.get(`${environment.apiWarehouseURL}/place/${id}`).toPromise().then(
    res=> {return this.placeList = res as Place[]}
  );
  
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
      warehouseId: item.warehouseId,
      room:item.room,
      roomId:item.roomId,
      column:item.column,
      columnId:item.columnId,
      rack: item.rack,
      rackId:item.rackId,
      side: item.side,
      shelf: item.shelf,
      shelfId:item.shelfId,
      place: item.place,
      placeId:item.placeId
    };
  }
  editItem(item:Item){
       
    return this.http.put(`${environment.apiWarehouseURL}/putitem/${item.id}`,item)
    
  }
  
}
