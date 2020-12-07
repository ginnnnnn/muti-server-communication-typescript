import express from 'express';
import { json } from 'body-parser';
import { taskRouter } from './routes/predict-task';

const app = express();
app.use(json());

app.use(taskRouter);

app.listen(5001, () => {
  console.log('task center is running');
});
