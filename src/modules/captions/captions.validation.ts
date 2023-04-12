import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';
import Joi from 'joi'

/**
 * Middleware to validate file uploads
 */
export const validateUpload = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'File not uploded'));
  }

  // Check if the uploaded file is a valid file
  const file = req.files['media'] as any;
  if (!file.mimetype.startsWith('video/')) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Incorrect file type'));
  }

  // Check if the file size is within the allowed limit
  const fileSizeLimit = 1024 * 1024 * 49; // 2 MB
  console.log(file.size);
  if (file.size > fileSizeLimit) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'File is too larg!'));
  }

  // If all checks pass, proceed to the next middleware
  return next();
};

export const getCaptions = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
