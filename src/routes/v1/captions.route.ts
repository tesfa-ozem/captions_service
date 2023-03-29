import express, { Router } from 'express';
import { captionController } from '../../modules/captions';
// import { auth } from '../../modules/auth';
const router: Router = express.Router();

router.post('/upload',captionController.createCaption)

export default router;