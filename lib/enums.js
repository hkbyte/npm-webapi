"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseStatus = exports.ResponseType = exports.RequestMethod = void 0;
var RequestMethod;
(function (RequestMethod) {
    RequestMethod["GET"] = "GET";
    RequestMethod["POST"] = "POST";
    RequestMethod["DELETE"] = "DELETE";
    RequestMethod["PATCH"] = "PATCH";
    RequestMethod["HEAD"] = "HEAD";
    RequestMethod["PUT"] = "PUT";
})(RequestMethod = exports.RequestMethod || (exports.RequestMethod = {}));
var ResponseType;
(function (ResponseType) {
    ResponseType["JSON"] = "JSON";
    ResponseType["HTML"] = "HTML";
})(ResponseType = exports.ResponseType || (exports.ResponseType = {}));
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus[ResponseStatus["OK"] = 200] = "OK";
    ResponseStatus[ResponseStatus["CREATED"] = 201] = "CREATED";
    ResponseStatus[ResponseStatus["NO_RESPONSE"] = 204] = "NO_RESPONSE";
})(ResponseStatus = exports.ResponseStatus || (exports.ResponseStatus = {}));
