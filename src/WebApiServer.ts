import express, { Express, RequestHandler } from 'express'
import bodyParser from 'body-parser'
import cors, { CorsOptions } from 'cors'
import helmet, { IHelmetConfiguration } from 'helmet'
import { PathParams } from './types'
import { RequestMethod } from './enums'
import WebApi from './WebApi'

type WebApiServerConfigs = {
    bodyLimit?: string
    helmet?: boolean
    cors?: boolean
    corsOptions?: CorsOptions
    helmetOptions?: IHelmetConfiguration
}

export default class WebApiServer {
    port: any
    server: Express

    constructor(port: any, configs: WebApiServerConfigs) {
        this.port = port
        this.server = express()
        const limit = configs.bodyLimit || '100kb'

        if (configs.cors) {
            this.server.use(
                configs.corsOptions ? cors(configs.corsOptions) : cors(),
            )
        }
        if (configs.helmet) {
            this.server.use(
                configs.helmetOptions
                    ? helmet(configs.helmetOptions)
                    : helmet(),
            )
        }

        this.server.use(bodyParser.json({ limit }))
        this.server.use(bodyParser.urlencoded({ limit, extended: true }))
    }

    /**
     * Start Server Listening
     */
    start(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.server.listen(this.port, () => {
                resolve(this.port)
            })
        })
    }

    /**
     * Add Middlewares
     */
    addMiddlewares(...middlewares: RequestHandler[]) {
        middlewares.forEach((el) => {
            this.server.use(el)
        })
    }

    /**
     * Add Routers
     */
    addRouter(path: PathParams, ...middlewares: RequestHandler[]) {
        this.server.use(path, ...middlewares)
    }

    addWebApis(...webApis: WebApi[]) {
        webApis.forEach((el) => {
            const handlers = [...el.middlewares, el.integrate]
            switch (el.method) {
                case RequestMethod.POST:
                    this.server.post(el.endpoint, ...handlers)
                    break
                case RequestMethod.GET:
                    this.server.get(el.endpoint, ...handlers)
                    break
                case RequestMethod.DELETE:
                    this.server.delete(el.endpoint, ...handlers)
                    break
                case RequestMethod.PATCH:
                    this.server.patch(el.endpoint, ...handlers)
                    break
                case RequestMethod.PUT:
                    this.server.put(el.endpoint, ...handlers)
                    break
                case RequestMethod.HEAD:
                    this.server.head(el.endpoint, ...handlers)
                    break
                default:
                    this.server.all(el.endpoint, ...handlers)
            }
        })
    }
}
