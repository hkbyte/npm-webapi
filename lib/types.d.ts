import { NextFunction, Request, Response } from 'express';
export declare type MiddlewareFunction = (req: Request, res: Response, next?: NextFunction) => any;
export declare type PathParams = string | RegExp | (string | RegExp)[];
