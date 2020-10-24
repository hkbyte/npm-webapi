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
const sendResponseError_1 = __importDefault(require("./sendResponseError"));
const express_form_data_1 = __importDefault(require("express-form-data"));
class WebApi {
    constructor(options) {
        this.method = options.method || enums_1.RequestMethod.POST;
        this.endpoint = options.endpoint;
        this.requestType = options.requestType || enums_1.RequestType.JSON;
        this.formDataOptions = options.formDataOptions || {};
        this.requestQuerySchema = options.requestQuerySchema;
        this.requestBodySchema = options.requestBodySchema;
        this.requestFileSchema = options.requestFileSchema;
        this.responseType = options.responseType || enums_1.ResponseType.JSON;
        this.responseStatus = options.responseStatus || enums_1.ResponseStatus.OK;
        this.hideErrorPath = lodash_1.default.isBoolean(options.hideErrorPath)
            ? options.hideErrorPath
            : false;
        this.hideErrorStack = lodash_1.default.isBoolean(options.hideErrorStack)
            ? options.hideErrorStack
            : process.env.NODE === 'production';
        this.hideErrorHint = lodash_1.default.isBoolean(options.hideErrorHint)
            ? options.hideErrorHint
            : process.env.NODE === 'production';
        this.handler = options.handler;
        this.middlewares = [];
        if (this.requestType === enums_1.RequestType.FORM_DATA_MULTIPART) {
            this.middlewares.push(express_form_data_1.default.parse(this.formDataOptions));
        }
        if (options.middlewares) {
            this.middlewares.push(...options.middlewares);
        }
        this.integrate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (res.headersSent)
                    return;
                let promisesValidators = [];
                if (!lodash_1.default.isUndefined(this.requestQuerySchema)) {
                    promisesValidators.push(this.requestQuerySchema.parse(req.query));
                }
                if (!lodash_1.default.isUndefined(this.requestBodySchema)) {
                    promisesValidators.push(this.requestBodySchema.parse(req.body));
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
                let files = undefined;
                // @ts-ignore
                console.log(req.files);
                if (this.requestType === enums_1.RequestType.FORM_DATA_MULTIPART) {
                    if (!lodash_1.default.isUndefined(this.requestFileSchema)) {
                        // @ts-ignore
                        files = this.requestFileSchema.parse(req.files);
                    }
                    else {
                        // @ts-ignore
                        files = req.files;
                    }
                }
                const responseData = {
                    success: true,
                    data: yield this.handler({
                        body: req.body,
                        query: req.query,
                        files,
                        params: req.params,
                        locals: res.locals,
                        req,
                        res,
                    }),
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
                sendResponseError_1.default(res, err, {
                    hideErrorStack: this.hideErrorStack || false,
                    hideErrorHint: this.hideErrorHint || false,
                    hideErrorPath: this.hideErrorPath || false,
                });
            }
        });
    }
    addMiddlewares(...middlewares) {
        this.middlewares = middlewares;
    }
}
exports.default = WebApi;
