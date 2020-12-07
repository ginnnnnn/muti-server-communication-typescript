import { Router } from 'express';
import { taskFetcherInvoker, predictTaskResult } from '../controllers/task';

const router = Router();

router.get('/task-radio', taskFetcherInvoker);
router.post('/task-result/:taskId', predictTaskResult);

export { router as taskRouter };
