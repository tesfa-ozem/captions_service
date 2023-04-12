// import httpStatus from 'http-status';
// import mongoose from 'mongoose';
import Caption from './captions.model';
// import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
// import logger from '../logger/logger';
import { NewCaption,ICaptionDoc } from './captions.interfaces';

/**
 * Create a caption
 * @param {NewCaption} userBody
 * @returns {Promise<ICaptionDoc>}
 */
export const createCaption = async (captionRecord: NewCaption): Promise<ICaptionDoc> => {
  
  return Caption.create(captionRecord);
};

/**
 * Query for captions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryCaptions = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> =>{
  const captions = await Caption.paginate(filter, options);
  return captions;
}
