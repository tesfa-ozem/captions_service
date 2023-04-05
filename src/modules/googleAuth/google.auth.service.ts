import { google } from 'googleapis';
import moment from 'moment';
import logger from '../logger/logger';
import config from '../../config/config';
import { User } from '../user';
import { tokenTypes, Token } from '../token';

const CLIENT_ID = config.google.clientId;
const CLIENT_SECRET = config.google.clientSecret;
const REDIRECT_URI = config.google.redirectUri;

const scopes = ['https://www.googleapis.com/auth/drive'];

const oauth2client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
export const getRedirectUrl = async (): Promise<string> => {
  try {
    const authorizationUrl = await oauth2client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      include_granted_scopes: true,
    });
    return authorizationUrl;
  } catch (error: any) {
    logger.warn(error.toString());
    return 'An error occured';
  }
};

export const generateGoogleAuthTokens = async (authCode: any): Promise<any> => {
  try {
    const { tokens } = await oauth2client.getToken(authCode);
    const googleRefreshToken = tokens.refresh_token as string;
    const googleAccessToken = tokens.access_token as string;
    const token_expiry_ms = tokens.expiry_date as number;
    const date = new Date(token_expiry_ms);
    const expiry_date = moment(date);
    console.log(JSON.stringify(tokens));
    // const expiry = moment().add(config.jwt.refreshExpirationDays, 'days');
    // Todo add validation for missing user
    saveGoogleTokens(googleRefreshToken, googleAccessToken, expiry_date);
  } catch (error: any) {
    return { error: error.toString() };
  }
};

/**
 * Save or update tokens if they exist
 * @param {string} googleRefreshToken
 * @param {string} googleAccessToken
 * @param {string} expiry_date for access token
 * @returns {Promise<void>} The uploaded file
 * @throws {ApiError} If there is an error uploading the file
 */

export const saveGoogleTokens = async (
  googleRefreshToken: string,
  googleAccessToken: string,
  expiry_date: any
): Promise<void> => {
  const google_auth_user = await User.findOne({ name: 'google_auth_user' });
  let refreshTokenUpdateResult;
  let googleAccessTokenUpdateResult;
  if (googleRefreshToken) {
    refreshTokenUpdateResult = await Token.findOneAndUpdate(
      { type: tokenTypes.GOOGLE_REFRESH, user: google_auth_user!.id },
      {
        token: googleRefreshToken,
        user: google_auth_user!.id,
        expires: expiry_date,
        type: tokenTypes.GOOGLE_REFRESH,
      },
      {
        new: true,
        upsert: true, // Make this update into an upsert
      }
    );
  } else {
    await oauth2client.revokeToken(googleAccessToken);
    throw Error('Failed to get refresh token, access token has been revoked. Try again');
  }

  if (googleAccessToken) {
    googleAccessTokenUpdateResult = await Token.findOneAndUpdate(
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
      logger.info('Tokens updated');
    } else {
      throw Error('Failed to update token.');
    }
  }
};
