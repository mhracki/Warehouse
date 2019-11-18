import { Component, OnInit } from '@angular/core';
import { WarehouseService } from 'src/app/shared/warehouse.service';
import { Warehouse } from 'src/app/shared/models/warehouse.model';
import { map, finalize } from 'rxjs/operators';
import { RoomList } from 'src/app/shared/models/roomList.model';
import { ColumnList } from 'src/app/shared/models/columnList.model';
import { RackList } from 'src/app/shared/models/rackList.model';
import { Side } from 'src/app/shared/models/side.model';
import { Shelf } from 'src/app/shared/models/shelf.model';
import { ChildQuantity } from 'src/app/shared/models/childQuantity.model';

@Component({
  selector: 'app-warehouse-management',
  templateUrl: './warehouse-management.component.html',
  styleUrls: ['./warehouse-management.component.scss']
})
export class WarehouseManagementComponent implements OnInit {
  isLinear = false;
  counter = 0;
  columnCounter = 0;
  rackCounter = 0;
  warehousePath: string[];
  shelfQuantity: ChildQuantity[] = [];
  placeListQuantity: ChildQuantity[] = [];
  placeQuantity: number[] = [];
  warehouse: Warehouse;
  roomList: RoomList[];
  columnList: ColumnList[];
  rackList: RackList[];
  sideList: Side[];
  shelfList: Shelf[];
  roomsCount: Array<any> = [{
    id: this.counter,
  }];
  columnCount: Array<any> = [{
    id: this.counter,
  }];
  rackCount: Array<any> = [{
    id: this.counter,
  }];
  constructor(private service: WarehouseService) { }

  ngOnInit() {

    this.initializeWarehouse();

  }

  initializeWarehouse() {
    this.service.warehouse = {
      id: '',
      name: ''
    };
  }
  async onSubmitWarehouse() {
    await this.service.postWarehouse().then(res => this.warehouse = res);
    await this.initializeRoom();
  }
  async onSubmitRoom() {
    this.service.postRoom().pipe(
      map(x => this.roomList = x),
      finalize(() => this.initializeColumn())).subscribe();
  }
  async onSubmitColumn() {

    this.service.postColumn().pipe(
      map(x => this.columnList = x),
      finalize(() => this.initializeRack())).subscribe();
  }
  async onSubmitRack() {

    this.service.postRack().pipe(
      map(x => this.rackList = x),
      finalize(() => {
        console.log(this.rackList, 'racklist');
        console.log(this.shelfQuantity, 'shelf quantity');

        this.rackList.forEach((x, index) => {
          this.service.sideList.push({
            id: '',
            name: 'lewa',
            rackId: x.id,
          })
          this.service.sideList.push({
            id: '',
            name: 'prawa',
            rackId: x.id,
          })
          this.shelfQuantity[index].parentId = x.id;
        })
        console.log(this.service.sideList);
        this.service.postSide().pipe(
          map(x => this.sideList = x),
          finalize(() => {
            this.sideList.forEach((x, j) => {
              for (let index = 0; index < (this.shelfQuantity.find(y => y.parentId === x.rackId).quantity); index++) {
                this.service.shelfList.push({
                  id: '',
                  name: index.toString(),
                  sideId: x.id,
                });
                this.placeQuantity.forEach(z => {
                  console.log(z, "z");

                  this.placeListQuantity.push({
                    quantity: z,
                    parentId: x.id
                  });
                });
              }

            });
            this.service.postShelf().pipe(
              map(x => this.shelfList = x),
              finalize(() => {
                this.shelfList.forEach(x => {
                  for (let index = 0; index < (this.placeListQuantity.find(y => y.parentId === x.sideId).quantity); index++) {
                    this.service.placeList.push({
                      id: '',
                      name: index.toString(),
                      shelfId: x.id,
                    })

                  }
                })
                this.service.postPlace().pipe(
                  map(x => console.log(x))).subscribe();
              }

              )).subscribe();

          }
          )
        ).subscribe();

      })).subscribe();
  }
  initializeRoom() {
    this.service.roomList[this.counter] = {
      id: '',
      name: '',
      warehouseId: this.warehouse.id
    };
    console.log('kupa');

  }
  initializeColumn(roomId?: string) {
    console.log(this.roomList);
    if (!roomId) {
      this.roomList.forEach((x, index) => {
        this.service.columnList.push({
          id: '',
          name: '',
          roomId: x.id
        });
        this.columnCounter++;
        x.columnCount = [index];
      });
      console.log(this.roomList);

    } else {
      this.service.columnList.push({
        id: '',
        name: '',
        roomId
      });
    }
    console.log('kupa21321213', this.service.columnList);
  }
  initializeRack(columnId?: string) {
    console.log(this.columnList);
    if (!columnId) {
      this.columnList.forEach((x, index) => {
        this.service.rackList.push({
          id: '',
          name: '',
          columnID: x.id
        });
        this.rackCounter++;
        x.rackCount = [index];
        this.shelfQuantity.push({
          quantity: 2,
          parentId: '',
        });
        this.placeQuantity.push(5);
      });
    } else {
      console.log("cos");

      this.service.rackList.push({
        id: '',
        name: '',
        columnID: columnId
      });
      this.shelfQuantity.push({
        quantity: 2,
        parentId: '',
      });
      this.placeQuantity.push(5);
    }
    console.log('kupa', this.service.rackList);
  }
  initializeShelfnPlace() {


  }

  addRoom() {
    this.counter++;
    this.initializeRoom();
    this.roomsCount.push({ id: this.counter });
    console.log(this.service.roomList);


  }
  addColumn(roomId) {
    const room = this.roomList.find(x => x.id === roomId);
    if (room.columnCount) {
      (room.columnCount).push(this.columnCounter);
    }
    this.columnCounter++;
    this.initializeColumn(roomId);
    this.columnCount.push({ id: this.columnCounter });
    console.log(this.roomList);
    console.log(this.columnCounter);
    console.log(this.service.columnList[this.columnCounter]);
  }
  addRack(columnId) {
    const column = this.columnList.find(x => x.id === columnId);
    if (column.rackCount) {
      (column.rackCount).push(this.rackCounter);
    } else {
      column.rackCount = [this.rackCounter];
    }
    this.rackCounter++;
    this.initializeRack(columnId);
    this.rackCount.push({ id: this.rackCounter });
    console.log(this.roomList);
    console.log(this.columnCounter);
    console.log(this.service.rackList[this.rackCounter]);
  }
}
