import { Warehouse } from './models/warehouse.model';
import { Room } from './models/room.model';
import { Column } from './models/column.model';
import { Rack } from './models/rack.model';
import { Shelf } from './models/shelf.model';
import { Place } from './models/place.model';

export class Item{
    id: string;
    itemName: string;
    quantity: number;
    warehouseId: string;
    warehouse: Warehouse;
    roomId:string;
    room:Room;
    columnId:string;
    column:Column;
    rackId:string;
    rack:Rack;
    side:boolean;
    shelfId:string;
    shelf:Shelf;
    placeId:string;
    place:Place;
    
}