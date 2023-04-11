import { google } from 'googleapis';
import { Readable } from 'stream';
import moment from 'moment';
import { logger } from '../logger';
import config from '../../config/config';
import { tokenService } from '../token';
import ApiError from '../errors/ApiError';
import { saveGoogleTokens } from '../googleAuth';
import {NewCaption} from '../captions/captions.interfaces'
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
export async function uploadFile(file: any, fields: any): Promise<NewCaption> {
  if (!file || !fields) {
    throw new ApiError(400, 'Missing required parameters');
  }

  const tokens = await tokenService.getGoogleTokens();

  if (!tokens || tokens.length === 0) {
    throw new ApiError(401, 'No valid tokens found');
  }

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
      fields: "id,name,mimeType,description,parents,webContentLink,webViewLink,iconLink,createdTime,modifiedTime,size"
    });

    
  } catch (err: any) {
    // logger.error(JSON.stringify(err.response.data.error))
    if (err.code === 401 && err.errors && err.errors[0].reason === 'authError') {
      //Access token has expired, so refresh it and try again
      const credentials: any = await oauth2Client.refreshAccessToken();
      const new_refreshToken = credentials.credentials.refresh_token;
      const new_accessToken =credentials.credentials.access_token;
      const token_expiry_ms = credentials.credentials.expiry_date as number;
      const date = new Date(token_expiry_ms);
      const expiry_date = moment(date);
   
      await saveGoogleTokens(
        new_refreshToken, 
        new_accessToken, 
        expiry_date);
      // Retry with the new token
      
      const new_drive = await authorizeDriveClient(new_accessToken, new_refreshToken);
      response = await new_drive.files.create({
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
    } else {
      throw new ApiError(err.code,`Error uploading file: ${err.response.data.error}`);
    }
  }
  logger.info(`File uploaded: ${JSON.stringify(response.data)}`);

  // Format the google drive response to exclude id and resign it to
  // driveId
  const reponseObject = {
    ...response.data,
    driveId:response.data.id
  }

  delete reponseObject.id

  return reponseObject;
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
