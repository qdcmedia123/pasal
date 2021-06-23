import {AckOrNack} from 'rascal';
import { Listener } from '../../common/base-listener';
import { queueGroupName } from '../../common/queu-group-name';
import { ProductCreatedEvent } from '../../common/product-created-event';



export class ProductCreatedListener extends Listener< ProductCreatedEvent > {
    queueGroupName = queueGroupName;
    async onMessage(data: ProductCreatedEvent['data'], message:any, ackOrNack:AckOrNack) {
       
        //console.log(`Message received to ProductCreatedListener!`)  
        //console.log(data);
       
        ackOrNack();
    }
}