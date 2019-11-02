import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ItemService } from 'src/app/shared/item.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.scss']
})
export class SchemaComponent implements OnInit {
  @ViewChild('schema',{static:true})
  schema:ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  

  constructor(private service:ItemService,private dialogRef:MatDialogRef<SchemaComponent>, private el:ElementRef){}


  rackQuantity:number;
  columnQuantity:number;
  placeQuantity:number;
  
  ngOnInit() {
   this.service.getRoomList(this.service.formData.warehouseId);
   this.service.getColumnList(this.service.formData.roomId);
   this.service.getRackList(this.service.formData.columnId);
   this.service.getPlaceList(this.service.formData.shelfId);
    this.resolveAfter();
    console.log(this.schema);
    
  }

  resolveAfter() {
    return new Promise(res => {
      setTimeout(() => {
        
        this.getWarehouseData();
        this.drawSchema();
        this.drawPoint();
      }, 500);
    });
  }
  getWarehouseData(){
   
        
    this.columnQuantity=this.service.columnList.length;
    this.rackQuantity=this.service.rackList.length;
    this.placeQuantity=this.service.rackList.length;
    console.log(this.columnQuantity);
    console.log(this.rackQuantity);

    
    
  }

  drawSchema( ){
    let sideRackWidth= this.schema.nativeElement.offsetWidth/(3*this.rackQuantity);
    
    this.schema.nativeElement.width=((window.innerWidth*0.8)-48);
    
    this.ctx = this.schema.nativeElement.getContext('2d');
    let rackWidth=0;
    console.log(sideRackWidth,"window width", window.innerWidth,"clie",this.schema.nativeElement.clientWidth, "width",this.schema.nativeElement.width );

    for (let index = 1; index <= this.rackQuantity; index++) {
     
      
         
      this.ctx.fillStyle = "#66339950";
      this.ctx.fillRect(rackWidth+sideRackWidth, 0,sideRackWidth, 50);
      this.ctx.fillStyle = "#999933";
      this.ctx.fillRect(rackWidth+(2*sideRackWidth), 0,sideRackWidth, 50);
      rackWidth=3*index*sideRackWidth;
      
      if(index===this.service.rackList.findIndex(x=>x.id===this.service.formData.rack.id)){
        this.ctx.fillStyle="red";
        console.log(index);
        
        this.ctx.fillRect(rackWidth+sideRackWidth,0,5,5);
      }
      
    }
    
    
  }
  drawPoint(){
    
  }
  onClose(){
    this.dialogRef.close();
  }

}
