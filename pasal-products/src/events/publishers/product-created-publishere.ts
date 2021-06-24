import {Publisher} from '../../common/base-publisher'
import { Subjects } from '../../common/subjects';
import { ProductCreatedEvent } from '../../common/product-created-event';

export class ProductCreatedPublisher extends Publisher <ProductCreatedEvent> {
    subject: Subjects.ProductCreated = Subjects.ProductCreated;
}