import { Component, OnInit } from '@angular/core';
import { ItemService } from 'src/app/shared/item.service';
import { MatDialogRef } from '@angular/material';
import { WarehouseService } from '../../shared/warehouse.service';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  title: string;

  constructor(
    private service: WarehouseService,
    private itemService: ItemService,
    private dialogRef: MatDialogRef<ItemComponent>
  ) {}

  async ngOnInit() {
    console.log(this.itemService.formData.itemName);
    await this.service.getWarehouseList();
    if (this.itemService.formData.id === null) {
      this.title = 'New Item';
      if (this.itemService.formData.itemName !== '') {
        this.title = 'Copy Item';
        this.initializeSelects();
      }
    } else {
      this.title = 'Edit Item';
      this.initializeSelects();
    }
  }

  async initializeSelects() {
    await this.service.getRoomList(this.itemService.formData.warehouseId);
    await this.service.getColumnList(this.itemService.formData.roomId);
    await this.service.getRackList(this.itemService.formData.columnId);
    await this.service.getSideList(this.itemService.formData.rackId);
    await this.service.getShelfList(this.itemService.formData.sideId);
    await this.service.getPlaceList(this.itemService.formData.shelfId);
  }

  onSubmit() {
    console.log(this.itemService.formData);
    if (this.itemService.formData.id === null) {
      this.itemService.postNewItem().subscribe(
        (res: any) => {
          this.dialogRef.close();
          this.itemService.refreshList();
        },
        err => {
          console.log(err);
        }
      );
    } else {
      this.itemService.editItem(this.itemService.formData).subscribe(
        res => {
          console.log(res);

          this.dialogRef.close();
        },

        err => console.log(err)
      );
    }
  }
  onClose() {
    this.dialogRef.close();
  }
  onClear() {
    this.itemService.formData = {
      id: '',
      itemName: '',
      quantity: null,
      warehouseId: '',
      warehouse: {
        id: '',
        name: ''
      },
      roomId: '',
      room: {
        id: '',
        name: '',
        warehouseId: ''
      },
      columnId: '',
      column: {
        id: '',
        name: '',
        roomId: ''
      },
      rackId: '',
      rack: {
        id: '',
        name: '',
        columnID: ''
      },
      sideId: '',
      side: {
        id: '',
        name: '',
        rackId: ''
      },
      shelfId: '',
      shelf: {
        id: '',
        name: '',
        sideId: ''
      },
      placeId: '',
      place: {
        id: '',
        name: '',
        shelfId: ''
      }
    };
  }
  async getRoom(id) {
    await this.service.getRoomList(id);
    this.itemService.formData.warehouse = this.service.warehouseList.find(
      x => x.id === id
    );
  }
  async getColumn(id) {
    await this.service.getColumnList(id);
    this.itemService.formData.room = this.service.roomList.find(x => x.id === id);
  }
  async getRack(id) {
    await this.service.getRackList(id);
    this.itemService.formData.column = this.service.columnList.find(x => x.id === id);
  }
  async getSide(id) {
    await this.service.getSideList(id);
    this.itemService.formData.rack = this.service.rackList.find(x => x.id === id);
  }
  async getShelf(id) {
    await this.service.getShelfList(id);
    this.itemService.formData.side = this.service.sideList.find(x => x.id === id);
  }
  async getPlace(id) {
    await this.service.getPlaceList(id);
    this.itemService.formData.shelf = this.service.shelfList.find(x => x.id === id);
  }
  setPlace(id) {
    this.itemService.formData.place = this.service.placeList.find(x => x.id === id);
  }
}
