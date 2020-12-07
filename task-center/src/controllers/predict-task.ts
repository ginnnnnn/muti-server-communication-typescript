import { RequestHandler } from 'express';
import { PredictTask } from '../models/PredictTask';
import axios from 'axios';
const taskList: PredictTask[] = [];

enum taskStatus {
  created = 'created',
  dispatched = 'dispatched',
  done = 'done',
}
interface IObjectKeys {
  [key: string]: string;
}
const MangerEquipmentMap: IObjectKeys = {
  m001: 'eq001',
  m002: 'eq002',
  m003: 'eq003',
};
const EquipmentModelUseMap: IObjectKeys = {
  eq001: 'a0101',
  eq002: 'a0201',
  eq003: 'a301',
};

const taskRadioInvoke = async () => {
  try {
    axios.get('http://localhost:5002/task-radio');
    axios.get('http://localhost:5003/task-radio');
  } catch (err) {}
};

export const createPredictTaskByEquipment: RequestHandler = (
  req,
  res,
  next
) => {
  const { equipmentId, predictData } = req.body as {
    equipmentId: string;
    predictData: string;
  };

  const modelUse = EquipmentModelUseMap[equipmentId];
  const newPredictTask = new PredictTask(
    equipmentId,
    predictData,
    modelUse,
    Math.random().toString(),
    taskStatus.created
  );

  taskList.push(newPredictTask);
  console.log('task created', newPredictTask.taskId);
  res.json(newPredictTask);
  taskRadioInvoke();
};

export const getPredictTask: RequestHandler<{
  managerId: string;
  taskNum: number;
}> = (req, res, next) => {
  const { managerId, taskNum } = req.params;
  const enqueryEquipId = MangerEquipmentMap[managerId];
  const unDispatchTasks = taskList.filter(
    ({ status, equipmentId }) =>
      status === taskStatus.created && equipmentId === enqueryEquipId
  );
  let desireTasks = taskList.filter(
    ({ status }) => status === taskStatus.created
  );
  if (unDispatchTasks.length > 0) {
    desireTasks = unDispatchTasks.slice(0, taskNum);
  }
  desireTasks.forEach(({ taskId, status }, index) => {
    const targetIndex = taskList.findIndex((t) => t.taskId === taskId);
    taskList[targetIndex].status = taskStatus.dispatched;
    desireTasks[index].status = taskStatus.dispatched;
  });
  res.json(desireTasks);
};

export const updatedPredictTask: RequestHandler<{ taskId: string }> = (
  req,
  res,
  next
) => {
  const { taskId } = req.params;
  const { result } = req.body as { result: string[] };
  const targetTaskIndex = taskList.findIndex(
    (t) => t.taskId === taskId && t.status === taskStatus.dispatched
  );
  if (targetTaskIndex < 0) {
    return res.json([]);
  }
  taskList[targetTaskIndex].result = result;
  taskList[targetTaskIndex].status = taskStatus.done;
  console.log('task done', taskList[targetTaskIndex].taskId);
  res.json(taskList[targetTaskIndex]);
};

export const gePredictResult: RequestHandler = (req, res, next) => {
  const result = taskList.filter((t) => t.status === taskStatus.done);
  res.json(result);
};
export const geTaskList: RequestHandler = (req, res, next) => {
  const list = taskList.map((t) => t.taskId);
  res.json(list);
};
