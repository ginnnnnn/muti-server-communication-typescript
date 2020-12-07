import express from 'express';
import { json } from 'body-parser';
import { taskRouter } from './routes/task';

const app = express();
app.use(json());

app.use(taskRouter);
app.listen(5003, () => {
  console.log('manager B is Running');
});

export const managerId = 'm002';
export const predictServerUrl = 'http://localhost:4003/task';
export const taskCenterUrl = 'http://localhost:5001/predict-task';
