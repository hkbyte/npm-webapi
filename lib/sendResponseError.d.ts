import { Response } from 'express';
export default function sendErrorResponse(res: Response, err: any, { hideErrorStack, hideErrorHint, hideErrorPath, }: {
    hideErrorStack?: boolean;
    hideErrorHint?: boolean;
    hideErrorPath?: boolean;
}): void;
