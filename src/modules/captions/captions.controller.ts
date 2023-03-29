import httpStatus from 'http-status';
import { Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import * as captionsService from './captions.service';
import * as storageService from '../storage/storage.service';


/*Controller to create a caption*/
export const createCaption = catchAsync(async (req: Request, res: Response) => {
  if(!req.files){
    throw new ApiError(httpStatus.BAD_REQUEST,'No file uploaded')
  }
  let uploadedFile = req.files
  const fileUrl = await storageService.uploadedFile(uploadedFile,req.fields)
  const reponse = await captionsService.createCaption(fileUrl,req.fields)
  res.status(httpStatus.CREATED).send(reponse);
});

// /*Controller to fetch captions*/
// export const getUsers = catchAsync(async (req: Request, res: Response) => {
//   const filter = pick(req.query, ['name', 'mediaType']);
//   const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page']);
//   const result = await captionsService.queryCaptions(filter, options);
//   res.send(result);
// });


// /*Controller to update captions*/
// export const getUsers = catchAsync(async (req: Request, res: Response) => {
//   if (typeof req.params['userId'] === 'string') {
//     const user = await captionsService.updateUserById(new mongoose.Types.ObjectId(req.params['userId']), req.body);
//     res.send(user);
//   }
// });


// export const deleteUser = catchAsync(async (req: Request, res: Response) => {
//   if (typeof req.params['userId'] === 'string') {
//     await captionsService.deleteCaptionsById(new mongoose.Types.ObjectId(req.params['userId']));
//     res.status(httpStatus.NO_CONTENT).send();
//   }
// });