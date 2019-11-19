import { Component, ViewChild, OnInit } from '@angular/core';
import { ItemService } from 'src/app/shared/item.service';
import {
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatDialog,
  MatDialogConfig
} from '@angular/material';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import { Item } from 'src/app/shared/models/item.model';
import { displayedColumn } from 'src/app/shared/models/displayedColumn.model';
import { ItemComponent } from '../item/item.component';
import { SchemaComponent } from '../schema/schema.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  itemList: Item[];
  displayedColumns: displayedColumn[] = [
    {
      key: 0,
      name: 'itemName',
      view: true
    },
    {
      key: 1,
      name: 'quantity',
      view: true
    },
    {
      key: 2,
      name: 'warehouse',
      view: true
    },
    {
      key: 3,
      name: 'room',
      view: true
    },
    {
      key: 4,
      name: 'column',
      view: true
    },
    {
      key: 5,
      name: 'rack',
      view: true
    },
    {
      key: 6,
      name: 'side',
      view: true
    },
    {
      key: 7,
      name: 'shelf',
      view: true
    },
    {
      key: 8,
      name: 'place',
      view: true
    },
    {
      key: 9,
      name: 'actions',
      view: true
    }
  ];
  disColStr: string[];
  disColKey: number[];
  disColView: boolean[];

  listData: MatTableDataSource<any>;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  disFilter = false;
  searchFilter = '';
  mq = window.matchMedia('(min-width: 500px)');
  itemOnPage = 100;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private service: ItemService,
    private matDialog: MatDialog,
    public breakpointObserver: BreakpointObserver
  ) {}
  ngOnInit() {
    this.disColStr = this.displayedColumns.map(x => x.name);
    this.disColKey = this.displayedColumns.map(x => x.key);
    this.disColView = this.displayedColumns.map(x => x.view);
    this.refreshMatTable();

    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.showOrHide(2);
          this.showOrHide(3);
          this.showOrHide(4);
          this.showOrHide(5);
          this.itemOnPage = 10;
        }
      });
    // this.service.getMaterial(this.service.itemList).then( () => {this.service.dataTable.sort= this.sort;
    //   console.log(this.service.dataTable);

    // this.service.dataTable.paginator = this.paginator});

    console.log(this.disColKey);
  }

  refreshMatTable() {
    this.service.refreshList().then(res => {
      this.service.itemList = res as Item[];
      // console.log(this.itemList[1].id);
      this.listData = new MatTableDataSource(this.service.itemList);
      this.listData.sort = this.sort;

      console.log(this.listData);

      this.listData.paginator = this.paginator;
      this.listData.filterPredicate = (data, filter) => {
        return data.itemName.indexOf(filter) !== -1;

        // return data.some(ele => {
        //   console.log(ele)
        //   console.log(data[ele]);
        //   //debugger;
        //   return (
        //     ele != "actions" &&data[ele]&& data[ele].indexOf(filter) != -1
        //   );
        // });
      };
    });
  }

  onSearch() {
    this.searchFilter = '';
    this.applyFilter();
  }
  applyFilter() {
    this.listData.filter = this.searchFilter.trim().toLowerCase();
  }

  showOrHide(id) {
    if (this.disColView[id]) {
      this.disColView[id] = false;
      this.disColStr = this.displayedColumns
        .filter(x => x.key !== id)
        .map(x => x.name);
      this.disColKey = this.disColKey.filter(x => x !== id);
    } else {
      this.disColView[id] = true;
      this.disColStr = this.displayedColumns.map(x => x.name);
      this.disColKey = this.disColKey.concat(id);
    }
    this.disColStr = this.displayedColumns
      .filter(x => x.key === this.disColKey.find(y => y === x.key))
      .map(x => x.name);
  }
  filterShow() {
    if (this.disFilter) {
      this.disFilter = false;
      console.log(this.disFilter);
    } else {
      this.disFilter = true;
      console.log(this.disFilter);
    }
  }

  resolveAfter(x) {
    return new Promise(res => {
      setTimeout(() => {
        res(x);
      }, 500);
    });
  }
  createItem() {
    this.service.formData = {
      id: null,
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
        columnsId: ''
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.matDialog
      .open(ItemComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => this.refreshMatTable());
  }
  deleteItem(itemID) {
    if (confirm('Are you sure to delete this record?')) {
      this.service.deleteItem(itemID).then(
        res => {
          console.log(res);
          this.refreshMatTable();
        },
        err => console.log(err)
      );
    }
  }

  editItem(item: Item) {
    this.service.formData = item;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    dialogConfig.data = item;
    console.log(dialogConfig.data, 'config');
    this.matDialog.open(ItemComponent, dialogConfig);
  }
  copyElement(item: Item) {
    this.service.formData = item;
    this.service.formData.id = null;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    dialogConfig.data = item;
    dialogConfig.data = { onClose: this.refreshMatTable };
    console.log(dialogConfig.data, 'config');
    this.matDialog
      .open(ItemComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => this.refreshMatTable());
  }
  drawSchema(item: Item) {
    this.service.formData = item;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '90%';
    dialogConfig.height = '80%';
    dialogConfig.data = item;
    this.matDialog.open(SchemaComponent, dialogConfig);
  }

  // }
  // sds(id: number) {
  //   console.log(id);
  //   switch (id) {
  //     case 0: {
  //      this.viewSwitching(id)
  //       break;
  //     }

  //     case 1: {
  //       if (this.viewQuantity) {
  //         this.viewQuantity = false;
  //         this.disColStr = this.displayedColumns
  //           .filter(x => x.key !== id)
  //           .map(x => x.name);
  //         this.disColKey = this.disColKey.filter(x => x !== id);
  //         console.log(this.disColKey);
  //       } else {
  //         this.viewQuantity = true;
  //         this.disColStr = this.displayedColumns.map(x => x.name);
  //         this.disColKey = this.disColKey.concat(id);
  //         console.log(this.disColKey);
  //       }

  //       break;
  //     }

  //     case 2: {
  //       if (this.viewWarehouse) {
  //         this.viewWarehouse = false;
  //         this.disColStr = this.displayedColumns
  //           .filter(x => x.key !== id)
  //           .map(x => x.name);
  //         this.disColKey = this.disColKey.filter(x => x !== id);
  //         console.log(this.disColKey);
  //       } else {
  //         this.viewWarehouse = true;
  //         this.disColStr = this.displayedColumns.map(x => x.name);
  //         this.disColKey = this.disColKey.concat(id);
  //         console.log(this.disColKey);
  //       }
  //       break;
  //     }
  //     case 3: {
  //       if (this.viewRack) {
  //         this.viewRack = false;
  //         this.disColStr = this.displayedColumns
  //           .filter(x => x.key !== id)
  //           .map(x => x.name);
  //         this.disColKey = this.disColKey.filter(x => x !== id);
  //         console.log(this.disColKey);
  //       } else {
  //         this.viewRack = true;
  //         this.disColStr = this.displayedColumns.map(x => x.name);
  //         this.disColKey = this.disColKey.concat(id);
  //         console.log(this.disColKey);
  //       }
  //       break;
  //     }
  //     case 4: {
  //       if (this.viewShelf) {
  //         this.viewShelf = false;
  //         this.disColStr = this.displayedColumns
  //           .filter(x => x.key !== id)
  //           .map(x => x.name);
  //         this.disColKey = this.disColKey.filter(x => x !== id);
  //         console.log(this.disColKey);
  //       } else {
  //         this.viewShelf = true;
  //         this.disColStr = this.displayedColumns.map(x => x.name);
  //         this.disColKey = this.disColKey.concat(id);
  //         console.log(this.disColKey);
  //       }
  //       break;
  //     }
  //     case 5: {
  //       if (this.viewPlace) {
  //         this.viewPlace = false;
  //         this.disColStr = this.displayedColumns
  //           .filter(x => x.key !== id)
  //           .map(x => x.name);
  //         this.disColKey = this.disColKey.filter(x => x !== id);
  //         console.log(this.disColKey);
  //       } else {
  //         this.viewPlace = true;
  //         this.disColStr = this.displayedColumns.map(x => x.name);
  //         this.disColKey = this.disColKey.concat(id);
  //         console.log(this.disColKey);
  //       }
  //       break;
  //     }
  //   }
  //   console.log("cale", this.disColKey);

  //   this.disColStr = this.displayedColumns
  //     .filter(x => x.key === this.disColKey.find(y => y === x.key))
  //     .map(x => x.name);
  //   console.log(this.disColStr, "console.log(this.disColStr);");
  //   console.log(this.displayedColumns, "displ");
  // }
}
