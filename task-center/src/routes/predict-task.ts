import { Router } from 'express';

const router = Router();
import {
  createPredictTaskByEquipment,
  getPredictTask,
  updatedPredictTask,
  gePredictResult,
  geTaskList,
} from '../controllers/predict-task';

router.post('/predict-task', createPredictTaskByEquipment);
router.get('/predict-task/:managerId/:taskNum', getPredictTask);
router.patch('/predict-task/:taskId', updatedPredictTask);
router.get('/predict-result', gePredictResult);
router.get('/tasklist', geTaskList);

export { router as taskRouter };
