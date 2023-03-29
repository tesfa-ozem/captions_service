import logger from '../logger/logger';
import { google } from 'googleapis';
import config from '../../config/config';

const CLIENT_ID = config.google.clientId;
const CLIENT_SECRET = config.google.clientSecret;
const REDIRECT_URI = config.google.redirectUri;

const scopes = ['https://www.googleapis.com/auth/drive']

const oauth2client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
)
export const getRedirectUrl = async (): Promise<string> => {
    try {
        const authorizationUrl = await oauth2client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true
        })
        return authorizationUrl;
    } catch (error: any) {
        logger.warn(error.toString())
        return "An error occured"
    }
}

export const generateGoogleAuthTokens = async (authCode: any): Promise<any> => {
    try {
       logger.warn(authCode);
        const { tokens } = await oauth2client.getToken(authCode);
        const googleAccessToken = tokens.access_token;
        const refreshToken = tokens.refresh_token;

        //Todo save the access and refresh tokens 
        return {
            "access":googleAccessToken,
            "refresh": refreshToken
        }
    } catch (error: any) {
        logger.warn(error.toString());
        return {"error":error.toString()}
    }
}