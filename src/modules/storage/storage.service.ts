import { google } from 'googleapis';
import { Readable } from 'stream';
import moment from 'moment';
import { logger } from '../logger';
import config from '../../config/config';
import { tokenService } from '../token';
import ApiError from '../errors/ApiError';
import { saveGoogleTokens } from '../googleAuth';
// import ApiError from '../errors/ApiError';
// import httpStatus from 'http-status';

const CLIENT_ID = config.google.clientId;
const CLIENT_SECRET = config.google.clientSecret;
const REDIRECT_URI = config.google.redirectUri;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// const PAGE_SIZE = 10;
// const TOKEN_EXPIRATION_THRESHOLD = 60 * 1000; // 1 minute

/**
 * Authorizes the Google Drive API client using the access token and refresh token
 * @param {string} accessToken The access token to use for authorization
 * @param {string} refreshToken The refresh token to use for authorization
 * @returns {google.drive.Drive} The authorized Google Drive API client
 */
async function authorizeDriveClient(accessToken: string, refreshToken: string): Promise<any> {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

/**
 * Uploads a file to Google Drive
 * @param {DriveFile} file The file to upload
 * @param {any} fields Additional fields for the file
 * @returns {Promise<google.drive.Schema$File>} The uploaded file
 * @throws {ApiError} If there is an error uploading the file
 */
export async function uploadFile(file: any, fields: any): Promise<any> {
  if (!file || !fields) {
    throw new ApiError(400, 'Missing required parameters');
  }

  const tokens = await tokenService.getGoogleTokens();

  if (!tokens || tokens.length === 0) {
    throw new ApiError(401, 'No valid tokens found');
  }

  logger.info(JSON.stringify(file.data));

  const accessToken = tokens.googleAcces.token;
  const refreshToken = tokens.googleRefresh.token;

  const drive = await authorizeDriveClient(accessToken, refreshToken);
  const stream = file.data;
  const folderId: string[] = fields.folderId ? [fields.folderId] : [];
  let response: any;

  try {
    response = await drive.files.create({
      requestBody: {
        name: fields.name,
        mimeType: file.mimetype,
        description: fields.description,
        parents: folderId,
      },
      media: {
        mimeType: file.mimetype,
        body: Readable.from(stream),
      },
    });

    logger.info(`File uploaded: ${response.id}`);
  } catch (err: any) {
    if (err.code === 401 && err.errors && err.errors[0].reason === 'authError') {
      // Access token has expired, so refresh it and try again
      const credentials: any = await oauth2Client.refreshAccessToken();
      const token_expiry_ms = credentials.expiry_date as number;
      const date = new Date(token_expiry_ms);
      const expiry_date = moment(date);
      await saveGoogleTokens(credentials.refresh_token, credentials.access_token, expiry_date);
      // Retry with the new token
      console.log(JSON.stringify(credentials));
      const drive = await authorizeDriveClient(credentials.access_token, credentials.refresh_token);
      response = await drive.files.create({
        requestBody: {
          name: fields.name,
          mimeType: file.mimetype,
          description: fields.description,
          parents: folderId,
        },
        media: {
          mimeType: file.mimetype,
          body: Readable.from(stream),
        },
      });
      console.log(response);
    } else {
      throw new ApiError(500, `Error uploading file: ${err.message}`);
    }
  }

  return response;
}

// export const isAccessTokenExpired = async (oauth2Client: any): Promise<void> => {
// 	if (oauth2Client.isAccessTokenExpired()) {
// 		// Refresh the access token
// 		const { data } = await oauth2Client.refreshAccessToken();
// 		const newAccessToken = data.access_token;

// 		// Store the new access token in db or wherever you want to store it
// 		// ...

// 		// Update the OAuth2 client with the new access token
// 		oauth2Client.setCredentials({

// 			access_token: newAccessToken,
// 		});
// 	}
// }
