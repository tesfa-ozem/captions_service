import logger from '../logger/logger';
import { google } from 'googleapis';
import config from '../../config/config';
import { User } from '../user';
import { tokenTypes, Token } from '../token';
import moment from 'moment';


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

        const { tokens } = await oauth2client.getToken(authCode);
        const googleAccessToken = tokens['access_token'];
        const refreshToken = tokens['refresh_token'] ;
        const token_expiry_ms = tokens.expiry_date as number
        const date = new Date(token_expiry_ms);
        const expiry_date = moment(date);
        // const expiry = moment().add(config.jwt.refreshExpirationDays, 'days');
        // Todo add validation for missing user
            
        const google_auth_user = await User.findOne({ name: 'google_auth_user' })

        if (refreshToken && googleAccessToken) {
            const refreshTokenUpdateResult = await Token.findOneAndUpdate(
                { type: tokenTypes.GOOGLE_REFRESH, user: google_auth_user!.id },
                {
                    token: refreshToken,
                    user: google_auth_user!.id,
                    expires: expiry_date,
                    type: tokenTypes.GOOGLE_REFRESH,
                },
                {
                    new: true,
                    upsert: true, // Make this update into an upsert
                }
            );

            const googleAccessTokenUpdateResult = await Token.findOneAndUpdate(
                { type: tokenTypes.GOOGLE_ACCESS, user: google_auth_user!.id },
                {
                    token: googleAccessToken,
                    user: google_auth_user!.id,
                    expires: expiry_date,
                    type: tokenTypes.GOOGLE_ACCESS,
                },
                {
                    new: true,
                    upsert: true, // Make this update into an upsert
                }
            );

            if (refreshTokenUpdateResult && googleAccessTokenUpdateResult) {
                logger.info("Tokens updated");
            } else {
                logger.error("Failed to update tokens");
            }

        } else {
            if (googleAccessToken)
                await oauth2client.revokeToken(googleAccessToken);
            throw Error("Failed to get refresh token, access token has been revoked. Try again")
        }
    } catch (error: any) {

        return { "error": error.toString() }
    }
}

