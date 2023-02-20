export interface IPhase {
  name: string;
  description: string;
}

export interface ICreateTask {
  name: string;
  description: string;
  phaseId: string;
}

export interface ICompleteTask {
  phaseId: string;
  taskId: string;
  completed: boolean
}

export interface ITask {
  taskId: string;
  name: string;
  description: string;
  completed: boolean;
}

export interface IPhaseDB {
  phaseId: string;
  name: string;
  description: string;
  tasks: Array<ITask>;
  done: boolean;
}

export interface CompleteTask {
  phaseId: string,
  taskIndex: number,
  completed: boolean
}

export interface IGetTask {
  phaseId: string,
  taskId: string
}
