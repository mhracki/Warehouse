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
import { Room } from 'src/app/shared/models/room.model';
import { Column } from 'src/app/shared/models/column.model';

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
  warehousePath: string[] = [];
  shelfQuantity: ChildQuantity[] = [];
  placeListQuantity: ChildQuantity[] = [];
  placeQuantity: number[] = [];
  warehouse: Warehouse;
  roomList: RoomList[];
  columnList: ColumnList[] = [];
  rackList: RackList[];
  sideList: Side[];
  shelfList: Shelf[];
  putWarehouse: boolean;
  putRoom: boolean;
  putColumn: boolean;
  roomsCount: Array<any> = [{
    id: this.counter,
  }];
  rackCount: Array<any> = [{
    id: this.counter,
  }];
  constructor(private service: WarehouseService) { }

  ngOnInit() {

    this.initializeWarehouse();
    this.putWarehouse = false;
    this.putRoom = false;
    this.putColumn = false;

  }


  async onSubmitWarehouse() {
    if (this.putWarehouse) {
      this.service.editWarehouse(this.service.warehouse).subscribe(res => console.log(res));
    } else {
      await this.service.postWarehouse().then(res => this.warehouse = res);
      await this.initializeRoom();

    }

  }
  async onSubmitRoom() {
    if (this.putRoom) {
      console.log(this.service.roomList);
      const putList: Room[] = [];
      const postList: Room[] = [];

      this.service.roomList.map(x => x.id !== '' ? putList.push(x) : postList.push(x));
      console.log('put', putList, 'post', postList);

      this.service.editRoom(putList).pipe(
        map(x => {
          this.roomList = x;
        }),
        finalize(() => {
          this.service.postRoom(postList).pipe(
            map(y => {
              this.roomList.push(...y as any);
              console.log(this.roomList, 'rumlist');
            }),
            finalize(() => {
              this.roomList.map(x =>  x.parentName = this.warehouse.name );
              this.initializeColumn();
            })
          ).subscribe();
        })
      ).subscribe();



    } else {
      this.service.postRoom().pipe(
        map(x => this.roomList = x as any),
        finalize(() => {
          this.roomList.map(x =>  x.parentName = this.warehouse.name );
          this.initializeColumn(); }
          )).subscribe();
    }
    console.log(this.service.roomList, 'rum');
    console.log(this.roomList, 'rum komponent');


  }
  async onSubmitColumn() {
    if (this.putColumn) {
      const putList: Column[] = [];
      const postList: Column[] = [];
      this.service.columnList.map(x => x.id !== '' ? putList.push(x) : postList.push(x));
      this.service.editColumn(putList).pipe(
        map(x => {
          this.columnList = x as any;
        }),
        finalize(() => {
          this.service.postColumn(postList).pipe(
            map(y => {
              this.columnList.push(...y as any);
              console.log(this.columnList, 'rumlist');
            }),
            finalize(() => {
              const b: any[] = [];
              console.log('dupa');
              this.roomList.forEach((y) => b.push((this.columnList.filter(z => z.roomId === y.id))));
              this.columnList = b.reduce((acc, val) => acc.concat(val), []);
              this.columnList.map( x => x.parentPath = `${this.roomList.find(y => x.roomId === y.id ).parentName}/
              ${this.roomList.find(y => x.roomId === y.id ).name}`);
              this.initializeRack();
            })
          ).subscribe();
        })
      ).subscribe();

    } else {
      this.service.postColumn().pipe(
        map(x => this.columnList = x as any),
        finalize(() => {
          const b: any[] = [];
          console.log('kupa');

          this.roomList.forEach((y) => b.push((this.columnList.filter(z => z.roomId === y.id))));
          this.columnList = b.reduce((acc, val) => acc.concat(val), []);
          this.columnList.map( x => x.parentPath = `${this.roomList.find(y => x.roomId === y.id ).parentName}
          /${this.roomList.find(y => x.roomId === y.id ).name}`);
          this.initializeRack();
        }

        )).subscribe();
    }
  }
  async onSubmitRack() {

    this.service.postRack().pipe(
      map(x => {
        this.rackList = x;
      }),
      finalize(() => {
        this.rackList.forEach((x, index) => {
          this.service.sideList.push({
            id: '',
            name: 'lewa',
            rackId: x.id,
          });
          this.service.sideList.push({
            id: '',
            name: 'prawa',
            rackId: x.id,
          });
          this.shelfQuantity[index].parentId = x.id;
        });
        console.log("rack");
        
        this.service.postSide().pipe(
          map(x => this.sideList = x),
          finalize(() => {
            this.sideList.forEach(x => {
              Array(this.shelfQuantity.find(y => y.parentId === x.rackId).quantity).map(z => {
                this.service.shelfList.push({
                  id: '',
                  name: z.toString(),
                  sideId: x.id,
                });
                this.placeQuantity.forEach(i => {
                  this.placeListQuantity.push({
                    quantity: i,
                    parentId: x.id
                  });
                });
              });

            });
            console.log("side");
            
            this.service.postShelf().pipe(
              map(x => {this.shelfList = x;
                console.log(x);
                
              }
                ),
              finalize(() => {
                console.log(this.shelfList,"shelflist");
                
                this.shelfList.forEach(x => {
                  for (let index = 0; index < (this.placeListQuantity.find(y => y.parentId === x.sideId).quantity); index++) {
                    this.service.placeList.push({
                      id: '',
                      name: index.toString(),
                      shelfId: x.id,
                    });

                  }
                });
                console.log("shelf");
                
                this.service.postPlace().pipe(
                  map(x => console.log(x))).subscribe();
              }

              )).subscribe(res=> console.log(res)
              );

          }
          )
        ).subscribe();

      })).subscribe();
  }
  initializeWarehouse() {
    this.service.warehouse = {
      id: '',
      name: ''
    };
  }
  initializeRoom() {
    this.service.roomList[this.counter] = {
      id: '',
      name: '',
      warehouseId: this.warehouse.id,
    };
  }
  initializeColumn(roomId?: string) {
    console.log('dupa');

    if (!roomId) {
      this.roomList.forEach((x, index) => {
        this.service.columnList.push({
          id: '',
          name: '',
          roomId: x.id
        });
        this.columnCounter++;
        x.columnCount = [index];
        console.log('asdsadasd');

      });
    } else {
      this.service.columnList.push({
        id: '',
        name: '',
        roomId
      });
      console.log('else');

    }
    console.log(this.service.columnList, 'service.columnlist');
    console.log(this.columnList, 'columnlist');
    console.log(this.columnCounter, 'columnCounter');



  }
  initializeRack(columnId?: string) {
    if (!columnId) {
      this.columnList.forEach((x, index) => {
        this.service.rackList.push({
          id: '',
          name: '',
          columnsId: x.id
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
      this.service.rackList.push({
        id: '',
        name: '',
        columnsId: columnId
      });
      this.shelfQuantity.push({
        quantity: 2,
        parentId: '',
      });
      this.placeQuantity.push(5);
    }
  }
  backToWarehouse() {
    this.putWarehouse = true;
    this.service.warehouse.id = this.warehouse.id;
  }
  backToRoom() {
    this.putRoom = true;
    this.service.roomList.forEach((x, index) =>
      x.id = this.roomList[index].id
    );
    if (this.putColumn) {
      this.service.columnList.forEach(x =>
        this.service.deleteColumn(x.id))
    }
    this.service.columnList = [];
    this.columnCounter = 0;
    
  }
  backToColumn() {
    this.putColumn = true;
    this.service.columnList.forEach((x, index) =>
      x.id = this.columnList[index].id);
    this.service.rackList = [];
    this.rackCounter = 0;
  }
  addRoom() {
    this.counter++;
    this.initializeRoom();
    this.roomsCount.push({ id: this.counter });
  }
  subRoom(roomId) {
    console.log(roomId);

    this.counter--;
    this.roomsCount.pop();
    this.service.roomList.pop();
    if (this.putRoom && roomId !== '') {
      this.service.deleteRoom(this.roomList[roomId].id).then(res => console.log(res));
    }
  }
  addColumn(roomId) {
    const room = this.roomList.find(x => x.id === roomId);
    if (room.columnCount) {
      (room.columnCount).push(this.columnCounter);
    }
    this.columnCounter++;
    this.initializeColumn(roomId);
  }
  subColumn(roomId, columnId) {
    console.log(columnId, 'columnID');
    let a;
    const room = this.roomList.find(x => x.id === roomId);
    if (room.columnCount) {
      a = (room.columnCount).pop();
    }
    this.columnCounter--;
    const changedColumns: any[] = [];
    changedColumns.push(...this.roomList.map(x => ({
      ...x,
      columnCount: x.columnCount.map(y => y >= a ? y - 1 : y)
    })));
    this.roomList = changedColumns;
    const indexToDelete = this.service.columnList.reverse().findIndex(x => x.roomId === roomId);
    this.service.columnList.splice(indexToDelete, 1);
    this.service.columnList.reverse();
    if (this.putColumn && columnId !== '') {
      this.service.deleteColumn(columnId).then(res => console.log(res));
    }
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
  }

  subRack(columnId) {
    let a;
    const column = this.columnList.find(x => x.id === columnId);
    if (column.rackCount) {
      a = (column.rackCount).pop();
    }
    this.rackCounter--;
    const changedRacks: any[] = [];
    changedRacks.push(...this.columnList.map(x => ({
      ...x,
      rackCount: x.rackCount.map(y => y >= a ? y - 1 : y)
    })));
    this.columnList = changedRacks;
    const indexToDelete = this.service.rackList.reverse().findIndex(x => x.columnsId === columnId);
    this.service.rackList.splice(indexToDelete, 1);
    this.service.rackList.reverse();
  }


}
