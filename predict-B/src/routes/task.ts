import { Router } from 'express';
import { createPredict } from '../controllers/task';

const router = Router();

router.post('/task', createPredict);

export { router as taskRouter };
