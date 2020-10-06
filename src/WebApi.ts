import { RequestMethod, ResponseStatus, ResponseType } from './enums'
import { Request, Response } from 'express'
import _ from 'lodash'
import { ZodError, ZodObject } from 'zod'
import { MiddlewareFunction, PathParams } from './types'
import { ValidationError } from './errors'

type WebApiOptions = {
    method?: RequestMethod
    endpoint: PathParams
    requestQuerySchema?: ZodObject<any>
    requestBodySchema?: ZodObject<any>
    responseType?: ResponseType
    responseStatus?: ResponseStatus
    hideErrorStack?: boolean
    hideErrorPath?: boolean
    hideErrorHint?: boolean
    handler: MiddlewareFunction
}

export default class WebApi {
    method: RequestMethod
    endpoint: PathParams
    requestQuerySchema: ZodObject<any> | undefined
    requestBodySchema: ZodObject<any> | undefined
    responseType: ResponseType
    responseStatus: ResponseStatus
    hideErrorPath: boolean
    hideErrorStack: boolean
    hideErrorHint: boolean
    handler: MiddlewareFunction
    integrate: MiddlewareFunction
    middlewares: MiddlewareFunction[]

    constructor(options: WebApiOptions) {
        this.method = options.method || RequestMethod.POST
        this.endpoint = options.endpoint
        this.requestQuerySchema = options.requestQuerySchema
        this.requestBodySchema = options.requestBodySchema
        this.responseType = options.responseType || ResponseType.JSON
        this.responseStatus = options.responseStatus || ResponseStatus.OK

        this.hideErrorStack = _.isBoolean(options.hideErrorStack)
            ? options.hideErrorStack
            : false

        this.hideErrorPath = _.isBoolean(options.hideErrorPath)
            ? options.hideErrorPath
            : process.env.NODE === 'production'

        this.hideErrorHint = _.isBoolean(options.hideErrorHint)
            ? options.hideErrorHint
            : process.env.NODE === 'production'

        this.handler = options.handler
        this.middlewares = []
        this.integrate = async (req: Request, res: Response) => {
            try {
                let promisesValidators = []
                if (!_.isUndefined(this.requestQuerySchema)) {
                    promisesValidators.push(
                        this.requestQuerySchema.parseAsync(req.query),
                    )
                }
                if (!_.isUndefined(this.requestBodySchema)) {
                    promisesValidators.push(
                        this.requestBodySchema.parseAsync(req.body),
                    )
                }
                const resolves = await Promise.all(promisesValidators)
                if (this.requestQuerySchema) {
                    req.query = resolves[0]
                }
                if (this.requestBodySchema) {
                    req.query = this.requestQuerySchema
                        ? resolves[1]
                        : resolves[0]
                }

                const responseData = {
                    success: true,
                    data: await this.handler(req, res),
                }

                const response = res.status(this.responseStatus)

                switch (this.responseType) {
                    case ResponseType.JSON:
                        response.json(responseData)
                        break
                    case ResponseType.HTML:
                        response.send(responseData)
                        break
                    default:
                        response.json(responseData)
                }
            } catch (err) {
                if (err instanceof ZodError) {
                    err = new ValidationError(
                        err.message,
                        err.stack,
                        err.flatten(),
                    )
                }
                res.status(err.httpStatus || 500).json({
                    success: false,
                    error: {
                        name: err.name || 'Internal Server Error',
                        message: err.message,
                        stack: this.hideErrorStack ? undefined : err.stack,
                        hint: this.hideErrorHint ? undefined : err.hint,
                        path: this.hideErrorPath ? undefined : err.path,
                    },
                })
            }
        }
    }

    addMiddlewares(middlewares: MiddlewareFunction[]) {
        this.middlewares = middlewares
    }
}
