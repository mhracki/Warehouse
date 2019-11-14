import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Warehouse } from './models/warehouse.model';
import { Room } from './models/room.model';
import { Column } from './models/column.model';
import { Rack } from './models/rack.model';
import { Side } from './models/side.model';
import { Shelf } from './models/shelf.model';
import { Place } from './models/place.model';
import { TempCRUD } from './models/tempCRUD.model';


@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  warehouseList: Warehouse[];
  roomList: Room[];
  columnList: Column[];
  rackList: Rack[];
  sideList: Side[];
  shelfList: Shelf[];
  placeList: Place[];
  warehouse: Warehouse;
  room: Room;
  column: Column;
  rack: Rack;
  side: Side;
  shelf: Shelf;
  place: Place;
  tempCRUD: TempCRUD;

  warehouseUrl = `${environment.apiWarehouseURL}/warehouse`;
  roomUrl = `${environment.apiWarehouseURL}/room`;
  columnUrl = `${environment.apiWarehouseURL}/column`;
  rackUrl = `${environment.apiWarehouseURL}/rack`;
  sideUrl = `${environment.apiWarehouseURL}/side`;
  shelfUrl = `${environment.apiWarehouseURL}/shelf`;
  placeUrl = `${environment.apiWarehouseURL}/place`;


  constructor(private http: HttpClient) { }

// Warehouse CRUD
  async getWarehouseList() {
    await this.http
      .get(`${this.warehouseUrl}/get`)
      .toPromise()
      .then(res => (this.warehouseList = res as Warehouse[]));
  }
  postWarehouse() {
    delete this.warehouse.id;
    return this.http.post(`${this.warehouseUrl}/post`, this.warehouse);
  }
  editWarehouse(warehouse: Warehouse) {
    return this.http.put(`${this.warehouseUrl}/put/${warehouse.id}`, warehouse);
  }
  deleteWarehouse(id) {
    console.log(id);
    return this.http
      .delete(`${this.warehouseUrl}/delete/${id}`)
      .toPromise();
  }

// Room CRUD
  async getRoomList(id) {
    await this.http
      .get(`${this.roomUrl}/get/${id}`)
      .toPromise()
      .then(res => (this.roomList = res as Room[]));
  }
  postRoom() {
    delete this.room.id;
    return this.http.post(`${this.roomUrl}/post`, this.room);
  }
  editRoom(room: Room) {
    return this.http.put(`${this.roomUrl}/put/${room.id}`, room);
  }
  deleteRoom(id) {
    console.log(id);
    return this.http
      .delete(`${this.roomUrl}/delete/${id}`)
      .toPromise();
  }

// Column CRUD
  async getColumnList(id) {
    await this.http
      .get(`${this.columnUrl}/get/${id}`)
      .toPromise()
      .then(res => (this.columnList = res as Column[]));
  }
  postColumn() {
    delete this.column.id;
    return this.http.post(`${this.column}/post`, this.column);
  }
  editColumn(column: Column) {
    return this.http.put(`${this.column}/put/${column.id}`, column);
  }
  deleteColumn(id) {
    console.log(id);
    return this.http
      .delete(`${this.column}/delete/${id}`)
      .toPromise();
  }

// Rack CRUD
  async getRackList(id) {
    await this.http
      .get(`${this.rackUrl}/get/${id}`)
      .toPromise()
      .then(res => (this.rackList = res as Rack[]));
  }
  postRack() {
    delete this.rack.id;
    return this.http.post(`${this.rackUrl}/post`, this.rack);
  }
  editRack(rack: Rack) {
    return this.http.put(`${this.rackUrl}/put/${rack.id}`, rack);
  }
  deleteRack(id) {
    console.log(id);
    return this.http
      .delete(`${this.rackUrl}/delete/${id}`)
      .toPromise();
  }

// Side CRUD
  async getSideList(id) {
    await this.http
      .get(`${this.sideUrl}/get/${id}`)
      .toPromise()
      .then(res => (this.sideList = res as Side[]));
  }
  postSide() {
    delete this.side.id;
    return this.http.post(`${this.sideUrl}/post`, this.side);
  }
  editSide(side: Side) {
    return this.http.put(`${this.sideUrl}/put/${side.id}`, side);
  }
  deleteSide(id) {
    console.log(id);
    return this.http
      .delete(`${this.sideUrl}/delete/${id}`)
      .toPromise();
  }

// Shelf CRUD
  async getShelfList(id) {
    await this.http
      .get(`${this.shelfUrl}/get/${id}`)
      .toPromise()
      .then(res => (this.shelfList = res as Shelf[]));
  }
  postShelf() {
    delete this.shelf.id;
    return this.http.post(`${this.shelfUrl}/post`, this.shelf);
  }
  editShelf(shelf: Shelf) {
    return this.http.put(`${this.shelfUrl}/put/${shelf.id}`, shelf);
  }
  deleteShelf(id) {
    console.log(id);
    return this.http
      .delete(`${this.shelfUrl}/delete/${id}`)
      .toPromise();
  }

// Place CRUD
  async getPlaceList(id) {
    await this.http
      .get(`${this.placeUrl}/get/${id}`)
      .toPromise()
      .then(res => (this.placeList = res as Place[]));
  }
  postPlace() {
    delete this.place.id;
    return this.http.post(`${this.placeUrl}/post`, this.place);
  }
  editPlace(place: Place) {
    return this.http.put(`${this.placeUrl}/put/${place.id}`, place);
  }
  deletePlace(id) {
    console.log(id);
    return this.http
      .delete(`${this.placeUrl}/delete/${id}`)
      .toPromise();
  }

  // CRUD for all
  postForAll(url) {
    delete this.tempCRUD.id;
    return this.http.post(`${url}/post`, this.tempCRUD);
  }
  editForAll(temp: TempCRUD, url) {
    return this.http.put(`${url}/put/${temp.id}`, temp);
  }
  deleteForAll(id, url) {
    return this.http.delete(`${url}/delete/${id}`).toPromise();
  }
}
