import {logger} from "../logger"
export const uploadedFile = async (file: any, fields: any): Promise<string>=>{
    logger.info(file.name)
    logger.info(fields.name)
    return ""
}