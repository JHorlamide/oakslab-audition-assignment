import { randomBytes } from "crypto";
import { IPhaseDB, IPhase, CompleteTask, IGetTask } from "../types/types";

class RepositoryService {
  // In-memory Database
  private phaseDB: { [phaseId: string]: IPhaseDB } = {};

  public createPhase(phaseBodyField: IPhase): IPhaseDB {
    const { name, description } = phaseBodyField;

    const phaseId = randomBytes(4).toString("hex");
    const newPhase = { phaseId, name, description, tasks: [], done: false };
    return this.phaseDB[phaseId] = newPhase;
  }

  public getAllPhases() {
    return this.phaseDB;
  }

  public getPhaseByPhaseId(phaseId: string) {
    return this.phaseDB[phaseId];
  }

  public getPhaseByName(name: string): boolean {
    return Object.values(this.phaseDB).some(phase => phase.name === name);
  }

  public getTaskIndex({ phaseId, taskId }: IGetTask) {
    return this.phaseDB[phaseId].tasks.findIndex((task) => task.taskId === taskId);
  }

  public markTaskComplete({ phaseId, taskIndex, completed }: CompleteTask) {
    this.phaseDB[phaseId].tasks[taskIndex].completed = completed
  }

  public getPreviousPhaseId(phaseId: string): string | null {
    const phaseIds = Object.keys(this.phaseDB);
    const index = phaseIds.findIndex(id => id === phaseId);
    return index > 0 ? phaseIds[index - 1] : null;
  }

  public getNextPhaseId(phaseId: string): string | null {
    const phaseIds = Object.keys(this.phaseDB);
    const index = phaseIds.findIndex(id => id === phaseId);
    return index < phaseIds.length - 1 ? phaseIds[index + 1] : null;
  }
}

export default new RepositoryService();
