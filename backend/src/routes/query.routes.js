import express from 'express';
import {
  createQuery,
  getQueries,
  getQueryById,
  updateQuery,
  deleteQuery,
} from '../controllers/query.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply protect middleware to all query routes since all of them require authentication
router.use(protect);

router.route('/')
  .post(createQuery)
  .get(getQueries);

router.route('/:id')
  .get(getQueryById)
  .put(updateQuery);

router.route('/:id/delete')
  .patch(deleteQuery);

export default router;
