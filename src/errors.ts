export class WebApiError extends Error {
    webApiErrorFlag: boolean
    statusCode: number
    name: string
    path?: any
    hint?: string

    constructor(message: string) {
        super(message)

        this.webApiErrorFlag = true
        this.statusCode = 500
        this.name = 'WebApiError'
        this.path = undefined
        this.hint = undefined
        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        Error.captureStackTrace(this, this.constructor)
    }
}

export class InternalServerError extends WebApiError {
    constructor(message: string, stack?: Error['stack']) {
        super(message)

        this.name = 'InternalServerError'
        if (stack) {
            this.stack = stack
        }
    }
}

export class UnimplementedError extends WebApiError {
    constructor(message: string, stack?: Error['stack']) {
        super(message)

        this.name = 'UnimplementedError'
        if (stack) {
            this.stack = stack
        }
        this.statusCode = 501
    }
}

export class BadGatewayError extends WebApiError {
    constructor(message: string, stack?: Error['stack']) {
        super(message)

        this.name = 'BadGatewayError'
        if (stack) {
            this.stack = stack
        }
        this.statusCode = 502
    }
}

export class BadRequestError extends WebApiError {
    constructor(message: string, stack?: Error['stack']) {
        super(message)

        this.name = 'BadRequestError'
        if (stack) {
            this.stack = stack
        }

        this.statusCode = 400
    }
}

export class ValidationError extends WebApiError {
    constructor(message: string, stack?: Error['stack'], path?: any) {
        super(message)

        this.name = 'ValidationError'
        if (stack) {
            this.stack = stack
        }
        if (path) {
            this.path = path
        }

        this.statusCode = 400
    }
}

export class UnauthorisedError extends WebApiError {
    constructor(message: string, stack?: Error['stack']) {
        super(message)

        this.name = 'UnauthorisedError'
        if (stack) {
            this.stack = stack
        }
        this.statusCode = 401
    }
}

export class ForbiddenError extends WebApiError {
    constructor(message: string, stack?: Error['stack']) {
        super(message)

        this.name = 'ForbiddenError'
        if (stack) {
            this.stack = stack
        }
        this.statusCode = 403
    }
}

export class NotFoundError extends WebApiError {
    constructor(message: string, stack?: Error['stack']) {
        super(message)

        this.name = 'NotFoundError'
        if (stack) {
            this.stack = stack
        }
        this.statusCode = 404
    }
}

export class AlreadyExistError extends WebApiError {
    constructor(message: string, stack?: Error['stack']) {
        super(message)

        this.name = 'AlreadyExistError'
        if (stack) {
            this.stack = stack
        }
        this.statusCode = 422
    }
}

export class InvalidArgumentError extends WebApiError {
    constructor(message: string, stack?: Error['stack']) {
        super(message)

        this.name = 'InvalidArgumentError'
        if (stack) {
            this.stack = stack
        }
        this.statusCode = 422
    }
}

export function isWebApiError(err: Error) {
    return err instanceof WebApiError
}
