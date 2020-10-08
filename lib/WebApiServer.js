"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const enums_1 = require("./enums");
class WebApiServer {
    constructor(port, configs) {
        this.port = port;
        this.server = express_1.default();
        const limit = configs.bodyLimit || '100kb';
        if (configs.cors) {
            this.server.use(configs.corsOptions ? cors_1.default(configs.corsOptions) : cors_1.default());
        }
        if (configs.helmet) {
            this.server.use(configs.helmetOptions
                ? helmet_1.default(configs.helmetOptions)
                : helmet_1.default());
        }
        this.server.use(body_parser_1.default.json({ limit }));
        this.server.use(body_parser_1.default.urlencoded({ limit, extended: true }));
    }
    /**
     * Start Server Listening
     */
    start() {
        return new Promise((resolve, reject) => {
            this.server.listen(this.port, () => {
                resolve(this.port);
            });
        });
    }
    /**
     * Add Middlewares
     */
    addMiddlewares(...middlewares) {
        middlewares.forEach((el) => {
            this.server.use(el);
        });
    }
    /**
     * Add Routers
     */
    addRouter(path, ...middlewares) {
        this.server.use(path, ...middlewares);
    }
    addWebApis(...webApis) {
        webApis.forEach((el) => {
            const handlers = [...el.middlewares, el.integrate];
            switch (el.method) {
                case enums_1.RequestMethod.POST:
                    this.server.post(el.endpoint, ...handlers);
                    break;
                case enums_1.RequestMethod.GET:
                    this.server.get(el.endpoint, ...handlers);
                    break;
                case enums_1.RequestMethod.DELETE:
                    this.server.delete(el.endpoint, ...handlers);
                    break;
                case enums_1.RequestMethod.PATCH:
                    this.server.patch(el.endpoint, ...handlers);
                    break;
                case enums_1.RequestMethod.PUT:
                    this.server.put(el.endpoint, ...handlers);
                    break;
                case enums_1.RequestMethod.HEAD:
                    this.server.head(el.endpoint, ...handlers);
                    break;
                default:
                    this.server.all(el.endpoint, ...handlers);
            }
        });
    }
}
exports.default = WebApiServer;
