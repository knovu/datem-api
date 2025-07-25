import { HttpExceptionOptions, NotFoundException } from '@nestjs/common';
import { ExceptionCause } from '@src/constants';

export class ResourceNotFound extends NotFoundException {
    /**
     * Instantiate a `ResourceNotFound` Exception.
     *
     * @example
     * `throw new ResourceNotFound()`
     *
     * @usageNotes
     * The HTTP response status code will be 404.
     * - The `objectOrError` argument defines the JSON response body or the message string.
     * - The `descriptionOrOptions` argument contains either a short description of the HTTP error or an options object used to provide an underlying error cause.
     *
     * By default, the JSON response body contains two properties:
     * - `statusCode`: this will be the value 404.
     * - `message`: the string `'Not Found'` by default; override this by supplying
     * a string in the `objectOrError` parameter.
     *
     * If the parameter `objectOrError` is a string, the response body will contain an
     * additional property, `error`, with a short description of the HTTP error. To override the
     * entire JSON response body, pass an object instead. Nest will serialize the object
     * and return it as the JSON response body.
     *
     * @param objectOrError string or object describing the error condition.
     * @param descriptionOrOptions either a short description of the HTTP error or an options object used to provide an underlying error cause
     */
    constructor(objectOrError?: any, descriptionOrOptions?: string | HttpExceptionOptions) {
        super(objectOrError, descriptionOrOptions);
        this.cause = ExceptionCause.RESOURCE_NOT_FOUND;
    }
}
