import {AckOrNack} from 'rascal';
import { Listener, ProductCreatedEvent } from '@pasal/common';
import { queueGroupName } from './queue-group-name';

export class ProductCreatedListener extends Listener< ProductCreatedEvent > {
    queueGroupName = queueGroupName;
    async onMessage(data: ProductCreatedEvent['data'], message:any, ackOrNack:AckOrNack) {
         console.log(`Message reveived on ProductCreatedListener`);
         console.log(data);
       
         ackOrNack();
    }
}