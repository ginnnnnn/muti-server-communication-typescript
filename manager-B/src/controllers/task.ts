import { RequestHandler } from 'express';
import axios from 'axios';
import { managerId, predictServerUrl, taskCenterUrl } from '../app';

interface TaskResponeType {
  equipmentId: string;
  predictData: string;
  modelId: string;
  taskId: string;
  status: string;
  result: [];
}
let taskUnSent: TaskResponeType[] = [];
let taskSent: TaskResponeType[] = [];
const taskCapacity = 2;
const processCapable = 1;

let isFetching = false;
let isSending = false;

const fetchTask = async () => {
  if (taskUnSent.length >= taskCapacity) {
    return;
  }
  if (isFetching) {
    return;
  }
  isFetching = true;
  try {
    const tasks = await axios.get<TaskResponeType[]>(
      `${taskCenterUrl}/${managerId}/${taskCapacity}`
    );
    if (tasks.data.length > 0) {
      tasks.data.forEach((t) => {
        taskUnSent.push(t);
      });
      //invoke send task
    }
    isFetching = false;
  } catch (err) {
    console.log(err);
  }
  setTimeout(() => {
    sendTask();
  });
};
const sendTask = async () => {
  if (taskSent.length >= processCapable) {
    return;
  }
  if (isSending) {
    return;
  }
  if (taskUnSent.length <= 0) {
    return;
  }
  //take the first one
  const tasksToSend = taskUnSent.splice(0, 1)[0];
  try {
    isSending = true;
    taskSent.push(tasksToSend);
    console.log('sending task', tasksToSend.taskId);
    await axios.post(`${predictServerUrl}`, {
      predictData: tasksToSend.predictData,
      modelId: tasksToSend.modelId,
      taskId: tasksToSend.taskId,
    });
    isSending = false;
  } catch (err) {
    //if  err put the task back
    taskUnSent.push(tasksToSend);
    console.log('send Task');
  }
  //taskInProcess return
  setTimeout(() => {
    fetchTask();
  });
};

const sendResult = async (taskId: string, result: string[]) => {
  console.log('recived result', taskId);
  try {
    const isDone = await axios.patch(`${taskCenterUrl}/${taskId}`, {
      result: result,
    });
    if (isDone.data.status === 'done') {
      taskSent = taskSent.filter((t) => t.taskId !== taskId);
      setTimeout(() => sendTask());
    } else {
      throw new Error('updated result error');
    }
  } catch (err) {
    console.log(err, 'result error');
    throw new Error('updated result error');
  }
};

export const taskFetcherInvoker: RequestHandler = (req, res, next) => {
  res.json({});
  fetchTask();
};

export const predictTaskResult: RequestHandler<{ taskId: string }> = (
  req,
  res,
  next
) => {
  const { taskId } = req.params;
  const { result } = req.body as { result: string[] };
  res.json({});
  sendResult(taskId, result);
};
