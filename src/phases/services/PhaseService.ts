import { randomBytes } from "crypto";
import { IPhaseDB, IPhase, ICreateTask, ICompleteTask } from "../types/types";

/*
  A repository service that communicates with the database could be implemented
  instead of directly querying the database within the PhaseService class. 
  This would allow for better separation of concerns and enable easier swapping of 
  the database implementation in the future.
*/
class PhaseService {
  // In-memory Database
  private phaseDB: { [phaseId: string]: IPhaseDB } = {};

  public getAllPhases() {
    return this.phaseDB;
  }

  public createNewPhase(phaseBodyField: IPhase): IPhaseDB {
    const { name, description } = phaseBodyField;
    const phaseId = randomBytes(4).toString("hex");

    if (!name || !description) {
      throw new Error("name and description are required fields");
    }

    if (Object.values(this.phaseDB).some(phase => phase.name === name)) {
      throw new Error(`Phase with name '${name}' already exists`);
    }

    const newPhase = { phaseId, name, description, tasks: [], done: false };
    return this.phaseDB[phaseId] = newPhase;
  }

  public createNewTask(taskBodyField: ICreateTask): IPhaseDB {
    const { name, description, phaseId } = taskBodyField;
    const taskId = randomBytes(4).toString("hex");

    if (!name ||!description || !phaseId) {
      throw new Error("name, description, and phaseId are required fields");
    }

    // find the phase to create task for.
    const phase = this.phaseDB[phaseId];
    if (!phase) {
      throw new Error("Phase note found");
    }

    phase.tasks.push({ taskId, name, description, completed: false })
    return phase;
  }

  public completeTask(completeTaskBodyField: ICompleteTask): IPhaseDB {
    const { phaseId, taskId, completed } = completeTaskBodyField;

    // check if phase exist with the given phaseId
    if (!this.phaseDB[phaseId]) {
      throw new Error("Phase not found");
    }

    // check task exist with the given taskId
    const taskIndex = this.phaseDB[phaseId].tasks.findIndex((task) => task.taskId === taskId);
    if (taskIndex < 0) {
      throw new Error("Task not found");
    }

    const previousPhaseId = this.getPreviousPhaseId(phaseId);
    if (previousPhaseId && !this.phaseDB[previousPhaseId].done) {
      throw new Error("Cannot mark task as completed until all tasks in previous phase are completed");
    }

    // mark task as completed.
    this.phaseDB[phaseId].tasks[taskIndex].completed = completed;

    //check if every task of a phase is completed
    if (this.phaseDB[phaseId].tasks.every(task => task.completed)) {
      this.phaseDB[phaseId].done = true;
      
      const nextPhaseId = this.getNextPhaseId(phaseId);
      if (nextPhaseId) {
        this.phaseDB[nextPhaseId].done = false;
      }
    }

    return this.phaseDB[phaseId];
  }

  public undoTask(taskBodyField: { phaseId: string, taskId: string }) {
    const { phaseId, taskId } = taskBodyField;

    // check if the phaseId and taskId are provided
    if (!phaseId || !taskId) {
      throw new Error("phaseId and taskId are required fields");
    }

    // check if the phase exist with the given phaseId.
    const phase = this.phaseDB[phaseId];
    if (!phase) {
      throw new Error("Phase not found");
    }

    // check if the task exist with the given taskId.
    const task = phase.tasks.find((task) => task.taskId === taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // check if the task is already completed.
    if (!task.completed) {
      throw new Error("Task is not completed");
    }

    //Update the status of task to false.
    task.completed = false;

    let allTaskCompleted = true;
    for (const task of phase.tasks) {
      if (!task.completed) {
        allTaskCompleted = false;
        break;
      }
    }

    phase.done = allTaskCompleted;
    return phase;
  }

  private getPreviousPhaseId(phaseId: string) {
    const phaseIds = Object.keys(this.phaseDB);
    const index = phaseIds.findIndex(id => id === phaseId);
    return index > 0 ? phaseIds[index - 1] : null;
  }

  private getNextPhaseId(phaseId: string) {
    const phaseIds = Object.keys(this.phaseDB);
    const index = phaseIds.findIndex(id => id === phaseId);
    return index < phaseIds.length - 1 ? phaseIds[index + 1] : null;
  }
}

export default new PhaseService();
