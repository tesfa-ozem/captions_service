import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {getRedirectUrl, generateGoogleAuthTokens} from './google.auth.service';
import catchAsync from '../utils/catchAsync';
export const userAuthorization = async (_req: Request, res: Response)=>{
    const redirectUri = await getRedirectUrl();
    res.status(httpStatus.CREATED).send({ 'redirectUri': redirectUri });
}

export const redirectCallBack = catchAsync(async(req: Request, res: Response)=>{
    const authCode = req.query['code'];
    const response = await generateGoogleAuthTokens(authCode)
    res.status(httpStatus.CREATED).send(response);
})