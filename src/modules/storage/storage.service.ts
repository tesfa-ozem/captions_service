import { Files } from "formidable";
import {logger} from "../logger"
export const uploadedFile = async (file: Files, fields: any): Promise<string>=>{
    logger.info(file)
    logger.info(fields)
    return ""
}