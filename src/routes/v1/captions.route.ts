import { captionController,validateUpload } from '../../modules/captions';
import express, { Router } from 'express';

// import { auth } from '../../modules/auth';



const router: Router = express.Router();

router.route('/').post(validateUpload ,captionController.createCaption);

export default router;