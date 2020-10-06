"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWebApiError = exports.InvalidArgumentError = exports.AlreadyExistError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorisedError = exports.ValidationError = exports.BadRequestError = exports.BadGatewayError = exports.UnimplementedError = exports.InternalServerError = exports.WebApiError = void 0;
class WebApiError extends Error {
    constructor(message) {
        super(message);
        this.webApiErrorFlag = true;
        this.statusCode = 500;
        this.name = 'WebApiError';
        this.path = undefined;
        this.hint = undefined;
        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.WebApiError = WebApiError;
class InternalServerError extends WebApiError {
    constructor(message, stack) {
        super(message);
        this.name = 'InternalServerError';
        if (stack) {
            this.stack = stack;
        }
    }
}
exports.InternalServerError = InternalServerError;
class UnimplementedError extends WebApiError {
    constructor(message, stack) {
        super(message);
        this.name = 'UnimplementedError';
        if (stack) {
            this.stack = stack;
        }
        this.statusCode = 501;
    }
}
exports.UnimplementedError = UnimplementedError;
class BadGatewayError extends WebApiError {
    constructor(message, stack) {
        super(message);
        this.name = 'BadGatewayError';
        if (stack) {
            this.stack = stack;
        }
        this.statusCode = 502;
    }
}
exports.BadGatewayError = BadGatewayError;
class BadRequestError extends WebApiError {
    constructor(message, stack) {
        super(message);
        this.name = 'BadRequestError';
        if (stack) {
            this.stack = stack;
        }
        this.statusCode = 400;
    }
}
exports.BadRequestError = BadRequestError;
class ValidationError extends WebApiError {
    constructor(message, stack, path) {
        super(message);
        this.name = 'ValidationError';
        if (stack) {
            this.stack = stack;
        }
        if (path) {
            this.path = path;
        }
        this.statusCode = 400;
    }
}
exports.ValidationError = ValidationError;
class UnauthorisedError extends WebApiError {
    constructor(message, stack) {
        super(message);
        this.name = 'UnauthorisedError';
        if (stack) {
            this.stack = stack;
        }
        this.statusCode = 401;
    }
}
exports.UnauthorisedError = UnauthorisedError;
class ForbiddenError extends WebApiError {
    constructor(message, stack) {
        super(message);
        this.name = 'ForbiddenError';
        if (stack) {
            this.stack = stack;
        }
        this.statusCode = 403;
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends WebApiError {
    constructor(message, stack) {
        super(message);
        this.name = 'NotFoundError';
        if (stack) {
            this.stack = stack;
        }
        this.statusCode = 404;
    }
}
exports.NotFoundError = NotFoundError;
class AlreadyExistError extends WebApiError {
    constructor(message, stack) {
        super(message);
        this.name = 'AlreadyExistError';
        if (stack) {
            this.stack = stack;
        }
        this.statusCode = 422;
    }
}
exports.AlreadyExistError = AlreadyExistError;
class InvalidArgumentError extends WebApiError {
    constructor(message, stack) {
        super(message);
        this.name = 'InvalidArgumentError';
        if (stack) {
            this.stack = stack;
        }
        this.statusCode = 422;
    }
}
exports.InvalidArgumentError = InvalidArgumentError;
function isWebApiError(err) {
    return err instanceof WebApiError;
}
exports.isWebApiError = isWebApiError;
