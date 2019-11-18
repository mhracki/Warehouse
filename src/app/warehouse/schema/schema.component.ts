import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ItemService } from 'src/app/shared/item.service';
import { WarehouseService } from 'src/app/shared/warehouse.service';

import { MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.scss']
})
export class SchemaComponent implements OnInit {
  @ViewChild('schema', { static: true })
  schema: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  title: string;

  constructor(
    private service: ItemService,
    private WHService: WarehouseService,
    private dialogRef: MatDialogRef<SchemaComponent>,
    private el: ElementRef
  ) {}

  rackQuantity: number;
  columnQuantity: number;
  placeQuantity: number;

  async ngOnInit() {
    await this.WHService.getRoomList(this.service.formData.warehouseId);
    await this.WHService.getColumnList(this.service.formData.roomId);
    await this.WHService.getRackList(this.service.formData.columnId);
    await this.WHService.getPlaceList(this.service.formData.shelfId);
    this.longestColumn();
    this.getWarehouseData();

    this.drawPoint();
    console.log(this.schema);
  }

  resolveAfter() {
    return new Promise(res => {
      setTimeout(() => {
        this.title = this.service.formData.room.name;
      }, 500);
    });
  }
  async longestColumn() {
    const longestColumn: number[] = [];

    for (let index = 0; index < this.WHService.columnList.length; index++) {
      console.log('asdasd', this.WHService.columnList[index].id);
      await this.WHService.getRackList(this.WHService.columnList[index].id);
      longestColumn[index] = this.WHService.rackList.length;
    }

    this.rackQuantity = Math.max(...longestColumn);
    console.log(this.rackQuantity, 'fajne');
    await this.drawSchema();
  }
  getWarehouseData() {
    this.columnQuantity = this.WHService.columnList.length;
    this.placeQuantity = this.WHService.placeList.length;
    console.log(this.columnQuantity);
  }
  drawBox(a, b, startX, startY, sideRackWidth) {
    this.ctx.fillRect(startX, startY, a, b);
    this.ctx.fillStyle = 'black';
    this.ctx.lineWidth = sideRackWidth / 2 / 20;
    this.ctx.lineWidth = sideRackWidth / 2 / 20;
    // przekątna
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(startX + a, startY + b);
    this.ctx.stroke();
    // przekątna
    this.ctx.moveTo(startX + a, startY);
    this.ctx.lineTo(startX, startY + b);
    this.ctx.stroke();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(startX + a, startY);
    this.ctx.lineTo(startX + a, startY + b);
    this.ctx.lineTo(startX, startY + b);
    this.ctx.lineTo(startX, startY);
    this.ctx.stroke();
  }

  async drawSchema() {
    const sideRackWidth =
      (window.innerWidth * 0.9 - 48) / (3 * this.rackQuantity) -
      1 / this.rackQuantity;
    const rackHeight =
      (window.innerHeight * 0.8 - 48) / this.columnQuantity -
      1 / this.columnQuantity;
    this.schema.nativeElement.width = window.innerWidth * 0.9 - 48;
    this.schema.nativeElement.height =
      window.innerHeight * 0.8 - 48 + 20 * this.columnQuantity;
    this.ctx = this.schema.nativeElement.getContext('2d');
    let rackWidth = 0;

    for (let j = 0; j < this.columnQuantity; j++) {
      const columnId = this.WHService.columnList[j].id;
      await this.WHService.getRackList(columnId);

      rackWidth = 0;
      this.rackQuantity = this.WHService.rackList.length;
      for (let index = 1; index <= this.rackQuantity; index++) {
        if (
          index - 1 ===
            this.WHService.rackList.findIndex(
              x => x.id === this.service.formData.rack.id
            ) &&
          this.WHService.columnList[j].id === this.service.formData.columnId
        ) {
          this.ctx.fillStyle = '#222';

          for (let i = 0; i <= this.placeQuantity; i++) {
            if (
              i ===
              this.WHService.placeList.findIndex(
                x => x.id === this.service.formData.place.id
              )
            ) {
              if (this.service.formData.side.name === '1') {
                this.ctx.fillRect(
                  rackWidth + sideRackWidth,
                  j * 20 +
                    j * rackHeight +
                    (i * rackHeight) / this.placeQuantity,
                  sideRackWidth,
                  rackHeight / this.placeQuantity
                );
              } else {
                this.ctx.fillRect(
                  rackWidth + sideRackWidth + sideRackWidth,
                  j * 20 +
                    j * rackHeight +
                    (i * rackHeight) / this.placeQuantity,
                  sideRackWidth,
                  rackHeight / this.placeQuantity
                );
              }
            }
          }
        }

        this.ctx.fillStyle = '#884ce380';
        this.ctx.fillRect(
          rackWidth + sideRackWidth,
          j * 20 + j * rackHeight,
          sideRackWidth,
          rackHeight
        );
        this.ctx.fillStyle = '#153DFF80';
        this.ctx.fillRect(
          rackWidth + 2 * sideRackWidth,
          j * 20 + j * rackHeight,
          sideRackWidth,
          rackHeight
        );
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(
          rackWidth + sideRackWidth,
          j * 20 + j * rackHeight,
          sideRackWidth * 2,
          10
        );
        this.ctx.fillRect(
          rackWidth + 2 * sideRackWidth - 5,
          j * 20 + j * rackHeight,
          10,
          rackHeight
        );
        this.ctx.fillRect(
          rackWidth + sideRackWidth,
          j * 20 + j * rackHeight + rackHeight,
          sideRackWidth * 2,
          10
        );
        if (
          index - 1 ===
            this.WHService.rackList.findIndex(
              x => x.id === this.service.formData.rack.id
            ) &&
          this.WHService.columnList[j].id === this.service.formData.columnId
        ) {
          this.ctx.fillStyle = '#AD8762';

          for (let i = 0; i <= this.placeQuantity; i++) {
            if (
              i ===
              this.WHService.placeList.findIndex(
                x => x.id === this.service.formData.place.id
              )
            ) {
              const a = sideRackWidth / 2;
              const b = rackHeight / this.placeQuantity / 2;
              if (this.service.formData.side.name === '1') {
                const startX = rackWidth + sideRackWidth + sideRackWidth / 4;
                const startY =
                  j * 20 +
                  j * rackHeight +
                  (i * rackHeight) / this.placeQuantity +
                  rackHeight / this.placeQuantity / 4;
                this.drawBox(a, b, startX, startY, sideRackWidth);
              } else {
                const startX =
                  rackWidth + sideRackWidth + sideRackWidth + sideRackWidth / 4;
                const startY =
                  j * 20 +
                  j * rackHeight +
                  (i * rackHeight) / this.placeQuantity +
                  rackHeight / this.placeQuantity / 4;
                this.drawBox(a, b, startX, startY, sideRackWidth);
              }
            }
          }
        }

        rackWidth = 3 * index * sideRackWidth;
      }
    }
  }
  drawPoint() {}
  onClose() {
    this.dialogRef.close();
  }
}
