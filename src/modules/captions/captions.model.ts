import mongoose from 'mongoose';
import { ICaptionDoc, ICaptionModel } from './captions.interfaces'; 
import {mediaTypes} from '../../config/mediaType'

const captionSchema = new mongoose.Schema<ICaptionDoc, ICaptionModel>(

    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        is_active: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: String
        },
        updatedAt: {
            type: String
        },
        mediaUrl: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        uploadedBy: {
            type: String,
            trim: true,
        },
        mediaType: {
            type: String,
            enum: mediaTypes,
            default: 'video'
        }

    },
    {
        timestamps: true,
    }
);

const Caption = mongoose.model<ICaptionDoc, ICaptionModel>('Caption', captionSchema);

export default Caption;