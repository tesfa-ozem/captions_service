import { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
export interface ICaption{
    name:string;
    createdAt: string;
    updatedAt: string;
    description: string;
    mediaUrl: string;
    uploadedBy: string;
    mediaType: string;
    is_active: boolean;
}

export interface ICaptionDoc extends ICaption, Document{

}

export interface ICaptionModel extends Model<ICaptionDoc>{
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type NewCaption = Omit<ICaption, 'mediaUrl'|'mediaType'>;