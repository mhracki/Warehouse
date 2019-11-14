import { Warehouse } from './warehouse.model';
import { Room } from './room.model';
import { Column } from './column.model';
import { Rack } from './rack.model';
import { Side } from './side.model';
import { Shelf } from './shelf.model';
import { Place } from './place.model';

export class Item {
    id: string;
    itemName: string;
    quantity: number;
    warehouseId: string;
    warehouse: Warehouse;
    roomId: string;
    room: Room;
    columnId: string;
    column: Column;
    rackId: string;
    rack: Rack;
    sideId: string;
    side: Side;
    shelfId: string;
    shelf: Shelf;
    placeId: string;
    place: Place;

}
