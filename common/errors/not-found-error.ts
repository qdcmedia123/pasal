import {CustomError} from './custom-error';
import { NotAuthorizedError } from './not-authorized-error';

export class NotFoundError extends CustomError {
    statusCode = 404;

    constructor() {
        super('Route not found');
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeErrors() {
        return [{message: 'Route not found'}]
    }
}