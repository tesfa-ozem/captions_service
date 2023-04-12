import express, { Router } from 'express';
import { captionController, validateCaptions, } from '../../modules/captions';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';

const router: Router = express.Router();

router
.route('/')
.post(validateCaptions.validateUpload, captionController.createCaption)
.get(auth(),validate(validateCaptions.getCaptions), captionController.getCaptions);

export default router;

/**
 * @swagger
 * tags:
 *   name: Captions
 *   description: Captions management and retrieval
 */

 /**
 * @swagger
 * /captions:
 *   get:
 *     summary: Get all captions
 *     description: Only admins can retrieve all users.
 *     tags: [Captions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Caption name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: projectBy
 *         schema:
 *           type: string
 *         description: project by query in the form of field:hide/include (ex. name:hide)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Captions'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
 