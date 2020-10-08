import { Express, RequestHandler } from 'express';
import { CorsOptions } from 'cors';
import { IHelmetConfiguration } from 'helmet';
import { PathParams } from './types';
import WebApi from './WebApi';
declare type WebApiServerConfigs = {
    bodyLimit?: string;
    helmet?: boolean;
    cors?: boolean;
    corsOptions?: CorsOptions;
    helmetOptions?: IHelmetConfiguration;
};
export default class WebApiServer {
    port: any;
    server: Express;
    constructor(port: any, configs: WebApiServerConfigs);
    /**
     * Start Server Listening
     */
    start(): Promise<any>;
    /**
     * Add Middlewares
     */
    addMiddlewares(...middlewares: RequestHandler[]): void;
    /**
     * Add Routers
     */
    addRouter(path: PathParams, ...middlewares: RequestHandler[]): void;
    addWebApis(...webApis: WebApi[]): void;
}
export {};
