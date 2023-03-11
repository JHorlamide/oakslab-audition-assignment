import { randomBytes } from "crypto";
import { IPhaseDB, IPhase, ICreateTask, ICompleteTask } from "../types/types";
import repositoryService from "../repository/RepositoryService";

class PhaseService {
  public getAllPhases() {
    return repositoryService.getAllPhases();
  }

  public createNewPhase(phaseBodyField: IPhase): IPhaseDB {
    const { name, description } = phaseBodyField;
    const phaseId = randomBytes(4).toString("hex");

    if (!name || !description) {
      throw new Error("name and description are required fields");
    }

    const phaseExist = repositoryService.getPhaseByName(name);
    if (phaseExist) {
      throw new Error(`Phase with name '${name}' already exists`);
    }

    const phase = { phaseId, name, description, tasks: [], done: false }
    const newPhase = repositoryService.createPhase(phase);
    return newPhase;
  }

  public createNewTask(taskBodyField: ICreateTask): IPhaseDB {
    const { name, description, phaseId } = taskBodyField;
    const taskId = randomBytes(4).toString("hex");

    if (!name || !description || !phaseId) {
      throw new Error("name, description, and phaseId are required fields");
    }

    //find the phase to create task for.
    const phase = repositoryService.getPhaseByPhaseId(phaseId);
    if (!phase) {
      throw new Error("Phase note found");
    }

    phase.tasks.push({ taskId, name, description, completed: false })
    return phase;
  }

  public completeTask(completeTaskBodyField: ICompleteTask): IPhaseDB {
    const { phaseId, taskId, completed } = completeTaskBodyField;

    // check if phase exist with the given phaseId
    const phase = repositoryService.getPhaseByPhaseId(phaseId);
    if (!phase) {
      throw new Error("Phase not found");
    }

    // check task exist with the given taskId
    const taskIndex = repositoryService.getTaskIndex({ phaseId, taskId });
    if (taskIndex < 0) {
      throw new Error("Task not found");
    }

    // Get the ID of the previous phase, if it exists
    const previousPhaseId = repositoryService.getPreviousPhaseId(phaseId);

    // If there is a previous phase, check if it's completed
    if (previousPhaseId) {
      const previousPhase = repositoryService.getPhaseByPhaseId(previousPhaseId);

      // If the previous phase is not completed, throw an error
      if (!previousPhase.done) {
        throw new Error("Cannot mark task as completed until all tasks in previous phase are completed");
      }
    }

    // mark task as completed.
    // phase.tasks[taskIndex].completed = completed;
    repositoryService.markTaskComplete({ phaseId, taskIndex, completed });

    //check if every task of a phase is completed
    if (phase.tasks.every(task => task.completed)) {
      phase.done = true;
      const nextPhaseId = repositoryService.getNextPhaseId(phaseId);
      if (nextPhaseId) {
        const nextPhase = repositoryService.getPhaseByPhaseId(nextPhaseId);
        nextPhase.done = false;
      }
    }

    return phase;
  }

  public undoTask(taskBodyField: { phaseId: string, taskId: string }) {
    const { phaseId, taskId } = taskBodyField;

    // check if the phaseId and taskId are provided
    if (!phaseId || !taskId) {
      throw new Error("phaseId and taskId are required fields");
    }

    // check if the phase exist with the given phaseId.
    const phase = repositoryService.getPhaseByPhaseId(phaseId);
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
}

export default new PhaseService();
