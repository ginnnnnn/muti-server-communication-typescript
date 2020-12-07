export class PredictTask {
  result: string[] = [];
  constructor(
    public equipmentId: string,
    public predictData: string,
    public modelId: string,
    public taskId: string,
    public status: string
  ) {}
}
