import express from 'express';
import { json } from 'body-parser';
import { taskRouter } from './routes/task';

const app = express();
app.use(json());

app.use(taskRouter);

app.listen(4002, () => {
  console.log('predict A is Running');
});

export const managerUrl = 'http://localhost:5002';
