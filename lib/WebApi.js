"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./enums");
const lodash_1 = __importDefault(require("lodash"));
const zod_1 = require("zod");
const errors_1 = require("./errors");
class WebApi {
    constructor(options) {
        this.method = options.method || enums_1.RequestMethod.POST;
        this.endpoint = options.endpoint;
        this.requestQuerySchema = options.requestQuerySchema;
        this.requestBodySchema = options.requestBodySchema;
        this.responseType = options.responseType || enums_1.ResponseType.JSON;
        this.responseStatus = options.responseStatus || enums_1.ResponseStatus.OK;
        this.hideErrorStack = lodash_1.default.isBoolean(options.hideErrorStack)
            ? options.hideErrorStack
            : false;
        this.hideErrorPath = lodash_1.default.isBoolean(options.hideErrorPath)
            ? options.hideErrorPath
            : process.env.NODE === 'production';
        this.hideErrorHint = lodash_1.default.isBoolean(options.hideErrorHint)
            ? options.hideErrorHint
            : process.env.NODE === 'production';
        this.handler = options.handler;
        this.middlewares = [];
        this.integrate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let promisesValidators = [];
                if (!lodash_1.default.isUndefined(this.requestQuerySchema)) {
                    promisesValidators.push(this.requestQuerySchema.parseAsync(req.query));
                }
                if (!lodash_1.default.isUndefined(this.requestBodySchema)) {
                    promisesValidators.push(this.requestBodySchema.parseAsync(req.body));
                }
                const resolves = yield Promise.all(promisesValidators);
                if (this.requestQuerySchema) {
                    req.query = resolves[0];
                }
                if (this.requestBodySchema) {
                    req.query = this.requestQuerySchema
                        ? resolves[1]
                        : resolves[0];
                }
                const responseData = {
                    success: true,
                    data: yield this.handler(req, res),
                };
                const response = res.status(this.responseStatus);
                switch (this.responseType) {
                    case enums_1.ResponseType.JSON:
                        response.json(responseData);
                        break;
                    case enums_1.ResponseType.HTML:
                        response.send(responseData);
                        break;
                    default:
                        response.json(responseData);
                }
            }
            catch (err) {
                if (err instanceof zod_1.ZodError) {
                    err = new errors_1.ValidationError(err.message, err.stack, err.flatten());
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
                });
            }
        });
    }
    addMiddlewares(middlewares) {
        this.middlewares = middlewares;
    }
}
exports.default = WebApi;
