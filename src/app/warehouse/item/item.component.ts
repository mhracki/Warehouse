import { Component, OnInit } from '@angular/core';
import { ItemService } from 'src/app/shared/item.service';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  title:string;

  constructor(private service:ItemService, private dialogRef:MatDialogRef<ItemComponent>) { }

  
  ngOnInit() {
    if(this.service.formData.id===null){
      this.title="New Item";
      if(this.service.formData.itemName!==""){
        this.title="Copy Item"
      }
    }
    else{
      this.title="Edit Item"
    }
    
  }


    
 
  onSubmit(){
    
    if (this.service.formData.id===null){
      this.service.postNewItem().subscribe( (res:any)=>{
        console.log(res);
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
      id: null,
      itemName: "",
      quantity: null,
      warehouse: "",
      room:"",
      column:"",
      rack: "",
      side:"",
      shelf: "",
      place: ""
    };
  }

}
