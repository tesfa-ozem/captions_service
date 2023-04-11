import { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface ICaption {
  driveId: string;
  name: string;
  mimeType: string;
  description: string;
  parents: string[];
  webContentLink: string;
  webViewLink: string;
  iconLink: string;
  createdTime: string;
  modifiedTime: string;
  size: string;

}

export interface ICaptionDoc extends ICaption, Document {}

export interface ICaptionModel extends Model<ICaptionDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type NewCaption = Partial<ICaption>;
