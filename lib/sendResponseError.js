"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const validator_1 = require("@hkbyte/validator");
function sendErrorResponse(res, err, { hideErrorStack, hideErrorHint, hideErrorPath, }) {
    if (res.headersSent) {
        return;
    }
    if (err instanceof validator_1.ParsingError) {
        err = new errors_1.ValidationError(err.message, err.stack, err.path);
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
    });
}
exports.default = sendErrorResponse;
