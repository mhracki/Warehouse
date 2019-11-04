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
  title:string;
  

  constructor(private service:ItemService,private dialogRef:MatDialogRef<SchemaComponent>, private el:ElementRef){}


  rackQuantity:number;
  columnQuantity:number;
  placeQuantity:number;
  
  async ngOnInit() {
   await this.service.getRoomList(this.service.formData.warehouseId);
   await this.service.getColumnList(this.service.formData.roomId);
   await this.service.getRackList(this.service.formData.columnId);
   await this.service.getPlaceList(this.service.formData.shelfId);
   this.getWarehouseData();
   await this.drawSchema();
   this.drawPoint();
    console.log(this.schema);
    
  }

  resolveAfter() {
    return new Promise(res => {
      setTimeout(() => {
        
        
        this.title=this.service.formData.room.name
      }, 500);
    });
  }
  async longestColumn(){
    let longestColumn:number[]=[];
    
    
    for (let index = 0; index < this.service.columnList.length; index++) {
      console.log("asdasd",this.service.columnList[index].id);
      await this.service.getRackList(this.service.columnList[index].id);
      longestColumn[index]= this.service.rackList.length;
      
    }
    console.log(Math.max(...longestColumn),"koasdkosadk");
    
   
  }
  getWarehouseData(){
   
        
    this.columnQuantity=  this.service.columnList.length;
    this.rackQuantity=  this.service.rackList.length;
    this.placeQuantity= this.service.placeList.length;
    console.log(this.columnQuantity);
    console.log(this.rackQuantity);

    
    
  }

  async drawSchema( ){
    

    let sideRackWidth= (((window.innerWidth*0.9)-48)/(3*this.rackQuantity)) -(1/this.rackQuantity) ;
    let rackHeight=(((window.innerHeight*0.8)-48)/(this.columnQuantity)) -(1/this.columnQuantity);
    this.schema.nativeElement.width=((window.innerWidth*0.9)-48);
    this.schema.nativeElement.height=((window.innerHeight*0.8)-48)+20*(this.columnQuantity);
    this.ctx = this.schema.nativeElement.getContext('2d');
    let rackWidth=0;
    console.log(this.placeQuantity,"place", this.columnQuantity,"column");
    console.log(this.schema);
    
    for (let j = 0; j < this.columnQuantity; j++) {
      let columnId = this.service.columnList[j].id;
      await this.service.getRackList(columnId);
console.log( columnId,"columnid");
console.log( this.service.rackList);
rackWidth=0;
      this.rackQuantity=this.service.rackList.length
      for (let index = 1; index <= this.rackQuantity; index++) {
     
        if(index-1===this.service.rackList.findIndex(x=>x.id===this.service.formData.rack.id)){
          this.ctx.fillStyle="red";
          console.log(index);
          for (let i = 0; i <=this.placeQuantity; i++) {
            if(i===this.service.placeList.findIndex(x=>x.id===this.service.formData.place.id))
            {
              this.ctx.fillRect(rackWidth+sideRackWidth,(j*20)+(j*rackHeight)+(i*rackHeight)/this.placeQuantity,sideRackWidth,  rackHeight/this.placeQuantity);
            }
          }
          
        }
           
        this.ctx.fillStyle = "#66339950";
        this.ctx.fillRect(rackWidth+sideRackWidth,(j*20)+ (j*rackHeight),sideRackWidth, rackHeight);
        this.ctx.fillStyle = "#ffd740";
        this.ctx.fillRect(rackWidth+(2*sideRackWidth),(j*20)+ (j*rackHeight),sideRackWidth,  rackHeight);
        rackWidth=3*index*sideRackWidth;
      
        
        
        
      }
      
    }
    
    
    
  }
  drawPoint(){
    
  }
  onClose(){
    this.dialogRef.close();
  }

}
