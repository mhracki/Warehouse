import { Injectable } from '@angular/core';
import { Item } from './models/item.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Warehouse } from './models/warehouse.model';
import { Room } from './models/room.model';
import { Column } from './models/column.model';
import { Rack } from './models/rack.model';
import { Shelf } from './models/shelf.model';
import { Place } from './models/place.model';
import { Side } from './models/side.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  formData: Item;
  itemList: Item[];
  dataTable: MatTableDataSource<any>;


  constructor(private http: HttpClient) {}

  postNewItem() {
    console.log(this.formData);
    delete this.formData.id;
    return this.http.post(`${environment.apiWarehouseURL}/item/post`, this.formData);
  }

  getItemList() {
    return this.http.get(`${environment.apiWarehouseURL}/item/get`).toPromise();
  }


  refreshList() {
    return this.getItemList().then(res => (this.itemList = res as Item[]));
  }

  getMaterial(itemsList) {
    return this.getItemList().then(() => {
      this.dataTable = new MatTableDataSource(itemsList);
      console.log(this.dataTable);
    });
  }

  deleteItem(id) {
    console.log(id);
    return this.http
      .delete(`${environment.apiWarehouseURL}/item/delete/${id}`)
      .toPromise();
  }

  initializeForm(item: Item) {
    this.formData = {
      id: item.id,
      itemName: item.itemName,
      quantity: item.quantity,
      warehouse: item.warehouse,
      warehouseId: item.warehouseId,
      room: item.room,
      roomId: item.roomId,
      column: item.column,
      columnId: item.columnId,
      rack: item.rack,
      rackId: item.rackId,
      side: item.side,
      sideId: item.sideId,
      shelf: item.shelf,
      shelfId: item.shelfId,
      place: item.place,
      placeId: item.placeId
    };
  }
  editItem(item: Item) {
    return this.http.put(
      `${environment.apiWarehouseURL}/item/put/${item.id}`,
      item
    );
  }
}
