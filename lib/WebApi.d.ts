import { RequestMethod, ResponseStatus, ResponseType, RequestType } from './enums';
import { RequestHandler, Request, Response } from 'express';
import { TypeObject } from '@hkbyte/validator';
import { PathParams } from './types';
import { FileObject } from './multipart/FileObject';
declare type WebApiHandler = ({ body, query, params, files, locals, req, res, }: {
    body: any;
    query: any;
    params: any;
    files: any;
    locals: any;
    req: Request;
    res: Response;
}) => Promise<any>;
declare type FormDataOptions = {
    autoClean?: boolean;
    maxFilesSize?: number;
    uploadDir?: string;
};
declare type WebApiOptions = {
    method?: RequestMethod;
    endpoint: PathParams;
    requestType?: RequestType;
    formDataOptions?: FormDataOptions;
    requestQuerySchema?: TypeObject;
    requestBodySchema?: TypeObject;
    requestFileSchema?: FileObject;
    responseType?: ResponseType;
    responseStatus?: ResponseStatus;
    hideErrorStack?: boolean;
    hideErrorPath?: boolean;
    hideErrorHint?: boolean;
    middlewares?: RequestHandler[];
    handler: WebApiHandler;
};
export default class WebApi {
    method: RequestMethod;
    endpoint: PathParams;
    requestType?: RequestType;
    formDataOptions?: FormDataOptions;
    requestQuerySchema?: TypeObject;
    requestBodySchema?: TypeObject;
    requestFileSchema?: FileObject;
    responseType: ResponseType;
    responseStatus: ResponseStatus;
    hideErrorPath: boolean;
    hideErrorStack: boolean;
    hideErrorHint: boolean;
    handler: WebApiHandler;
    integrate: RequestHandler;
    middlewares: RequestHandler[];
    constructor(options: WebApiOptions);
    addMiddlewares(...middlewares: RequestHandler[]): void;
}
export {};
