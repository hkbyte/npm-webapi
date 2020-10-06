import { NextFunction, Request, Response } from 'express'

export type MiddlewareFunction = (
    req: Request,
    res: Response,
    next?: NextFunction,
) => any

export type PathParams = string | RegExp | (string | RegExp)[]
