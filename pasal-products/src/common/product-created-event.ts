import {Subjects} from './subjects';

export interface ProductCreatedEvent {
    subject: Subjects.ProductCreated;
    data: {
        version: number,
        id: string,
    }
}