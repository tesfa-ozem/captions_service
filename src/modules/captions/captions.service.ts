// import httpStatus from 'http-status';
// import mongoose from 'mongoose';
// import Caption from './captions.model';
// import ApiError from '../errors/ApiError';
// import { IOptions, QueryResult } from '../paginate/paginate';
// import { ICaptionDoc, NewCaption} from './captions.interfaces';

/**
 * Create a caption
 * @param {NewCaption} userBody
 * @returns {Promise<ICaptionDoc>}
 */
export const createCaption = async (mediaUrl:string,captionRecord:any): Promise<string> => {
    console.log(`${mediaUrl} ${captionRecord}`)
    return ""
}