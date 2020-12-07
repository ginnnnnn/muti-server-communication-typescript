import { RequestHandler } from 'express';
import { managerUrl } from '../app';
import axios from 'axios';

interface TaskRequestType {
  predictData: string;
  modelId: string;
  taskId: string;
}

const doingPredict = async (taskId: string): Promise<void> => {
  console.log('Predicting', taskId);
  let time = new Date().getTime();
  while (1) {
    const dif = new Date().getTime() - time;
    if (dif > 5000) {
      break;
    }
  }
  try {
    const res = await axios.post(`${managerUrl}/task-result/${taskId}`, {
      result: [Math.random().toString(), Math.random().toString()],
    });
  } catch (err) {
    console.log(err);
  }
};

export const createPredict: RequestHandler = (req, res, next) => {
  const { predictData, modelId, taskId } = req.body as TaskRequestType;
  res.send({});
  doingPredict(taskId);
};
