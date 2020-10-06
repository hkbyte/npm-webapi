import { RequestMethod, ResponseStatus, ResponseType } from './enums';
import { ZodObject } from 'zod';
import { MiddlewareFunction, PathParams } from './types';
declare type WebApiOptions = {
    method?: RequestMethod;
    endpoint: PathParams;
    requestQuerySchema?: ZodObject<any>;
    requestBodySchema?: ZodObject<any>;
    responseType?: ResponseType;
    responseStatus?: ResponseStatus;
    hideErrorStack?: boolean;
    hideErrorPath?: boolean;
    hideErrorHint?: boolean;
    handler: MiddlewareFunction;
};
export default class WebApi {
    method: RequestMethod;
    endpoint: PathParams;
    requestQuerySchema: ZodObject<any> | undefined;
    requestBodySchema: ZodObject<any> | undefined;
    responseType: ResponseType;
    responseStatus: ResponseStatus;
    hideErrorPath: boolean;
    hideErrorStack: boolean;
    hideErrorHint: boolean;
    handler: MiddlewareFunction;
    integrate: MiddlewareFunction;
    middlewares: MiddlewareFunction[];
    constructor(options: WebApiOptions);
    addMiddlewares(middlewares: MiddlewareFunction[]): void;
}
export {};
