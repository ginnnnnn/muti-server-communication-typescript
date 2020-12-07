import express from 'express';
import { json } from 'body-parser';
import { taskRouter } from './routes/task';

const app = express();
app.use(json());

app.use(taskRouter);
app.listen(5002, () => {
  console.log('manager A is Running');
});

export const managerId = 'm001';
export const predictServerUrl = 'http://localhost:4002/task';
export const taskCenterUrl = 'http://localhost:5001/predict-task';
