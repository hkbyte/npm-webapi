import { ValidationError } from './errors'
import { ParsingError } from '@hkbyte/validator'
import { Response } from 'express'

export default function sendErrorResponse(
    res: Response,
    err: any,
    {
        hideErrorStack,
        hideErrorHint,
        hideErrorPath,
    }: {
        hideErrorStack?: boolean
        hideErrorHint?: boolean
        hideErrorPath?: boolean
    },
) {
    if (res.headersSent) {
        return
    }

    if (err instanceof ParsingError) {
        err = new ValidationError(err.message, err.stack, err.path)
    }

    res.status(err.httpStatus || 500).json({
        success: false,
        error: {
            name: err.name || 'Internal Server Error',
            message: err.message,
            stack: hideErrorStack ? undefined : err.stack,
            hint: hideErrorHint ? undefined : err.hint,
            path: hideErrorPath ? undefined : err.path,
        },
    })
}
