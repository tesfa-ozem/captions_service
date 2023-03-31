import { logger } from "../logger"
import { google } from 'googleapis';
import config from '../../config/config';
import { tokenService } from '../token';
// import ApiError from '../errors/ApiError';
// import httpStatus from 'http-status';


const CLIENT_ID = config.google.clientId;
const CLIENT_SECRET = config.google.clientSecret;
const REDIRECT_URI = config.google.redirectUri;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
)

export const uploadedFile = async (_file: any, _fields: any): Promise<string> => {
    // const now = new Date().getTime();
    const tokens = await tokenService.getGoogleTokens();
    const accessToken = tokens.googleAcces.token
    const refreshToken = tokens.googleRefresh.token;

    // logger.info(tokens);
    if (tokens.length === 0) {
        throw new Error('No valid tokens found');
    }

    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    // const files = await drive.files.list({ pageSize: 10});

    // const expiryDate = oauth2Client.credentials.expiry_date;
    // const expiresInMs = expiryDate - now;
    // const isTokenExpiring = expiresInMs < 60 * 1000
     try {
     drive.files.list(
       {
         q:"('1ZyJ3nfXYm0AzkadF00d3mNMAFcSR1kKi' in pare    nts) and mimeType = 'application/vnd.google-apps.folder    '",
         fields:
           "nextPageToken, files(hasThumbnail,id,created    Time,size,name,description,iconLink)",
       },
       (err, resp:any) => {
         if (err){
             throw new Error(`${err.message}`);
         }
           
         let files = resp.data.files;
         if (files.length) {
           logger.warn(files);
      
         } else {
           
         }
       }
     );
   } catch (err:any) {
     throw new Error(`${err.message}`);
   }

    return "";
}

