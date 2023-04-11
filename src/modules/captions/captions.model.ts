import mongoose from 'mongoose';
import { ICaptionDoc, ICaptionModel } from './captions.interfaces';
// import { mediaTypes } from '../../config/mediaType';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';

const captionSchema = new mongoose.Schema<ICaptionDoc, ICaptionModel>(
  {
    driveId: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: false,
    },
    parents: {
      type: [String],
      required: true,
    },
    webContentLink: {
      type: String,
      required: true,
      trim: true,
    },
    webViewLink: {
      type: String,
      required: true,
      trim: true,
    },
    iconLink: {
      type: String,
      required: true,
      trim: true,
    },
    createdTime: {
      type: String,
      required: true,
      trim: true,
    },
    modifiedTime: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
captionSchema.plugin(toJSON);
captionSchema.plugin(paginate);
const Caption = mongoose.model<ICaptionDoc, ICaptionModel>('Caption', captionSchema);

export default Caption;
