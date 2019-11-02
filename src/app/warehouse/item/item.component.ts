import { Component, OnInit } from '@angular/core';
import { ItemService } from 'src/app/shared/item.service';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import{warehouse,column,room } from '../../shared/mock-warehouse'
import { Item } from 'src/app/shared/item.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  title:string;
  mockWar=warehouse;
  mockCol=column;
  mockRoom=room;

  constructor(private service:ItemService, private dialogRef:MatDialogRef<ItemComponent>) { }

  
  ngOnInit() {
    console.log(this.service.formData.itemName)
    this.service.getWarehouseList();
    if(this.service.formData.id===null){
      this.title="New Item";
      if(this.service.formData.itemName!==""){
        this.title="Copy Item"
        this.initializeSelects()
      }
    }
    else{
      this.title="Edit Item"
      this.initializeSelects()
    }
  }

  initializeSelects(){
    this.service.getRoomList(this.service.formData.warehouseId);
    this.service.getColumnList(this.service.formData.roomId);
    this.service.getRackList(this.service.formData.columnId);
    this.service.getShelfList(this.service.formData.rackId);
    this.service.getPlaceList(this.service.formData.shelfId);
  }


    
 
  onSubmit(){
    console.log(this.service.formData);
    if (this.service.formData.id===null){
      //this.service.formData.id="00000000-0000-0000-0000-000000000asd";
      this.service.postNewItem().subscribe( (res:any)=>{
        //this.dialogRef.afterClosed()
        this.dialogRef.close();
        this.service.refreshList();
      },err=>{
        console.log(err);
      })
    }else{
      this.service.editItem(this.service.formData).subscribe( res=>
    {console.log(res)
    
      this.dialogRef.close();}
        
      ,err =>console.log(err)
      
      );
      
    }
    
  }
  onClose(){
    this.dialogRef.close();
  }
  onClear(){
    this.service.formData = {
      id: "",
      itemName: "",
      quantity: null,
      warehouseId:"",
      warehouse: {
        id:"",
        name:""
      },
      roomId: "",
      room:{
        id:"",
        name:"",
        warehouseId:""
      },
      columnId:"",
      column:{
        id:"",
        name:"",
        roomId:""
      },
      rackId:"",
      rack: {
        id:"",
        name:"",
        side:null,
        columnID:""

      },
      side:null,
      shelfId:"",
      shelf: {
        id:"",
        name:"",
        rackId:""
        
      },
      placeId:"",
      place: {
        id:"",
        name:"",
        shelfId:""
        
      },
    };
  }
  getRoom(id){
      this.service.getRoomList(id);
      console.log(this.service.roomList);
      
      this.service.formData.warehouse=this.service.warehouseList.find(x=>x.id===id)
  }
  getColumn(id){
      this.service.getColumnList(id);
      this.service.formData.room=this.service.roomList.find(x=>x.id===id)
  }
  getRack(id){
    this.service.getRackList(id);
    this.service.formData.column=this.service.columnList.find(x=>x.id===id)
  

}
getShelf(id){
  this.service.getShelfList(id);
  this.service.formData.rack=this.service.rackList.find(x=>x.id===id)
}
getPlace(id){
  this.service.getPlaceList(id);
  this.service.formData.shelf=this.service.shelfList.find(x=>x.id===id)

}
placeId(id){
  this.service.formData.place=this.service.placeList.find(x=>x.id===id)

}
test(item){
  console.log(this.service.formData.warehouse,"serwis");
  
}


}
