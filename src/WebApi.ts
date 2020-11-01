import {
    RequestMethod,
    ResponseStatus,
    ResponseType,
    RequestType,
} from './enums'
import { RequestHandler, Request, Response } from 'express'
import _ from 'lodash'
import { TypeObject } from '@hkbyte/validator'
import { PathParams } from './types'
import sendErrorResponse from './sendResponseError'
import expressFormData from 'express-form-data'
import { FileObject } from './multipart/FileObject'

type WebApiHandler = ({
    body,
    query,
    params,
    files,
    locals,
    req,
    res,
}: {
    body: any
    query: any
    params: any
    files: any
    locals: any
    req: Request
    res: Response
}) => Promise<any>

type FormDataOptions = {
    autoClean?: boolean
    maxFilesSize?: number
    uploadDir?: string
}

type WebApiOptions = {
    method?: RequestMethod
    endpoint: PathParams
    requestType?: RequestType
    formDataOptions?: FormDataOptions
    requestQuerySchema?: TypeObject
    requestBodySchema?: TypeObject
    requestFileSchema?: FileObject
    responseType?: ResponseType
    responseStatus?: ResponseStatus
    hideErrorStack?: boolean
    hideErrorPath?: boolean
    hideErrorHint?: boolean
    middlewares?: RequestHandler[]
    handler: WebApiHandler
}

export default class WebApi {
    method: RequestMethod
    endpoint: PathParams
    requestType?: RequestType
    formDataOptions?: FormDataOptions
    requestQuerySchema?: TypeObject
    requestBodySchema?: TypeObject
    requestFileSchema?: FileObject
    responseType: ResponseType
    responseStatus: ResponseStatus
    hideErrorPath: boolean
    hideErrorStack: boolean
    hideErrorHint: boolean
    handler: WebApiHandler
    integrate: RequestHandler
    middlewares: RequestHandler[]

    constructor(options: WebApiOptions) {
        this.method = options.method || RequestMethod.POST
        this.endpoint = options.endpoint
        this.requestType = options.requestType || RequestType.JSON
        this.formDataOptions = options.formDataOptions || {}
        this.requestQuerySchema = options.requestQuerySchema
        this.requestBodySchema = options.requestBodySchema
        this.requestFileSchema = options.requestFileSchema
        this.responseType = options.responseType || ResponseType.JSON
        this.responseStatus = options.responseStatus || ResponseStatus.OK

        this.hideErrorPath = _.isBoolean(options.hideErrorPath)
            ? options.hideErrorPath
            : false

        this.hideErrorStack = _.isBoolean(options.hideErrorStack)
            ? options.hideErrorStack
            : process.env.NODE === 'production'

        this.hideErrorHint = _.isBoolean(options.hideErrorHint)
            ? options.hideErrorHint
            : process.env.NODE === 'production'

        this.handler = options.handler

        this.middlewares = []
        if (this.requestType === RequestType.FORM_DATA_MULTIPART) {
            this.middlewares.push(expressFormData.parse(this.formDataOptions))
        }
        if (options.middlewares) {
            this.middlewares.push(...options.middlewares)
        }

        this.integrate = async (req, res, next) => {
            try {
                if (res.headersSent) return

                let promisesValidators = []
                if (!_.isUndefined(this.requestBodySchema)) {
                    promisesValidators.push(
                        this.requestBodySchema.parse(req.body),
                    )
                }
                if (!_.isUndefined(this.requestQuerySchema)) {
                    promisesValidators.push(
                        this.requestQuerySchema.parse(req.query),
                    )
                }
                const resolves = await Promise.all(promisesValidators)
                if (this.requestBodySchema) {
                    req.body = resolves[0] as any
                }
                if (this.requestQuerySchema) {
                    req.query = this.requestBodySchema
                        ? (resolves[1] as any)
                        : (resolves[0] as any)
                }

                let files: any = undefined
                if (this.requestType === RequestType.FORM_DATA_MULTIPART) {
                    if (!_.isUndefined(this.requestFileSchema)) {
                        // @ts-ignore
                        files = this.requestFileSchema.parse(req.files)
                    } else {
                        // @ts-ignore
                        files = req.files
                    }
                }

                const responseData = {
                    success: true,
                    data: await this.handler({
                        body: req.body,
                        query: req.query,
                        files,
                        params: req.params,
                        locals: res.locals,
                        req,
                        res,
                    }),
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
                sendErrorResponse(res, err, {
                    hideErrorStack: this.hideErrorStack || false,
                    hideErrorHint: this.hideErrorHint || false,
                    hideErrorPath: this.hideErrorPath || false,
                })
            }
        }
    }

    addMiddlewares(...middlewares: RequestHandler[]) {
        this.middlewares = middlewares
    }
}
