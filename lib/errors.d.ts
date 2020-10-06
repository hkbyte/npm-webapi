export declare class WebApiError extends Error {
    webApiErrorFlag: boolean;
    statusCode: number;
    name: string;
    path?: any;
    hint?: string;
    constructor(message: string);
}
export declare class InternalServerError extends WebApiError {
    constructor(message: string, stack?: Error['stack']);
}
export declare class UnimplementedError extends WebApiError {
    constructor(message: string, stack?: Error['stack']);
}
export declare class BadGatewayError extends WebApiError {
    constructor(message: string, stack?: Error['stack']);
}
export declare class BadRequestError extends WebApiError {
    constructor(message: string, stack?: Error['stack']);
}
export declare class ValidationError extends WebApiError {
    constructor(message: string, stack?: Error['stack'], path?: any);
}
export declare class UnauthorisedError extends WebApiError {
    constructor(message: string, stack?: Error['stack']);
}
export declare class ForbiddenError extends WebApiError {
    constructor(message: string, stack?: Error['stack']);
}
export declare class NotFoundError extends WebApiError {
    constructor(message: string, stack?: Error['stack']);
}
export declare class AlreadyExistError extends WebApiError {
    constructor(message: string, stack?: Error['stack']);
}
export declare class InvalidArgumentError extends WebApiError {
    constructor(message: string, stack?: Error['stack']);
}
export declare function isWebApiError(err: Error): boolean;
