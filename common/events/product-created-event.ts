import {Subjects} from './subjects';

export interface ProductCreatedEvent {
    subject: Subjects.ProductCreated;
    data: {
        version: number,
        id: string,
        userId:string,
        name?:string;
        category?:string;
        subCategory?:string;
        availableItems?:string;
        mediaLinks?:string;
    }
}