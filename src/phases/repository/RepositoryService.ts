import { IPhaseDB, CompleteTask, IGetTask } from "../types/types";

class RepositoryService {
  // In-memory Database
  private phaseDB: { [phaseId: string]: IPhaseDB } = {};

  public createPhase(phaseBodyField: IPhaseDB): IPhaseDB {
    const { phaseId } = phaseBodyField;

    return this.phaseDB[phaseId] = phaseBodyField;
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
    const index = phaseIds.indexOf(phaseId);

    if (index === -1) {
      return null;
    }

    const previousPhaseId = phaseIds.slice(0, index).reverse().find(id => !!this.phaseDB[id]);
    return previousPhaseId || null;
  }

  public getNextPhaseId(phaseId: string): string | null {
    const phaseIds = Object.keys(this.phaseDB);
    const index = phaseIds.indexOf(phaseId);

    if (index === -1) {
      return null;
    }

    const nextPhaseId = phaseIds.slice(index + 1).find(id => !!this.phaseDB[id]);
    return nextPhaseId || null;
  }
}

export default new RepositoryService();
