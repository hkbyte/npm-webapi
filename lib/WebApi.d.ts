import { RequestMethod, ResponseStatus, ResponseType } from './enums';
import { RequestHandler } from 'express';
import { ZodObject } from 'zod';
import { PathParams } from './types';
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
    middlewares?: RequestHandler[];
    handler: RequestHandler;
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
    handler: RequestHandler;
    integrate: RequestHandler;
    middlewares: RequestHandler[];
    constructor(options: WebApiOptions);
    addMiddlewares(...middlewares: RequestHandler[]): void;
}
export {};
